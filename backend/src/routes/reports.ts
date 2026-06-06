import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { getGradeFromPercentage } from '../utils/constants';

const router = Router();

router.get('/student/:id/pdf', async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.params.id;

    // 1. Fetch Student Data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*, class_streams(name, code)')
      .eq('id', studentId)
      .single();

    if (studentError) throw studentError;

    // 2. Fetch Grades Data
    const { data: grades, error: gradesError } = await supabase
      .from('student_grades')
      .select(`
        score,
        assessments ( id, title, max_score, type, date ),
        subjects!student_grades_subject_id_fkey ( id, name, code )
      `)
      .eq('student_id', studentId);
    
    // Fallback if subjects mapping isn't directly on grades yet (based on schema)
    // Wait, let's just fetch assessments and we can display them.
    // Actually, student_grades connects to assessments, and assessments connect to subjects.
    const { data: gradesDetailed, error: gradesDetailedError } = await supabase
      .from('student_grades')
      .select(`
        score,
        assessments ( id, title, max_score, type, date, subject_id, subjects (name, code) )
      `)
      .eq('student_id', studentId);

    if (gradesDetailedError) throw gradesDetailedError;

    // 3. Process Data for Template
    let totalScore = 0;
    let totalMax = 0;
    const processedGrades = gradesDetailed?.map((g: any) => {
      const score = g.score;
      const max = g.assessments?.max_score || 100;
      const pct = (score / max) * 100;
      totalScore += score;
      totalMax += max;
      return {
        assessment: g.assessments?.title,
        subject: g.assessments?.subjects?.name || 'General',
        type: g.assessments?.type,
        score: score,
        max: max,
        percentage: pct.toFixed(1),
        grade: getGradeFromPercentage(pct).label
      };
    }) || [];

    const finalPct = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    const finalGrade = getGradeFromPercentage(finalPct);

    // 4. Render HTML Template
    const templatePath = path.join(__dirname, '../templates/report_card.ejs');
    const html = await ejs.renderFile(templatePath, {
      student: {
        name: `${student.first_name} ${student.last_name}`,
        id: student.student_id_number,
        stream: student.class_streams?.name || 'N/A',
        enrollmentDate: new Date(student.enrollment_date).toLocaleDateString()
      },
      grades: processedGrades,
      summary: {
        average: finalPct.toFixed(1),
        grade: finalGrade.label,
        gpa: finalGrade.gpaValue.toFixed(1)
      },
      dateGenerated: new Date().toLocaleDateString()
    });

    // 5. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Critical for server environments like Railway
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    // 6. Send PDF to Client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${student.first_name}_${student.last_name}_ReportCard.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.end(pdfBuffer);

  } catch (err: any) {
    console.error("PDF Generation Error:", err);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

export default router;
