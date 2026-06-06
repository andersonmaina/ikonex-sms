import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { getGradeFromPercentage, GRADING_SYSTEM } from '../utils/constants';

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
    const { data: gradesDetailed, error: gradesDetailedError } = await supabase
      .from('student_grades')
      .select(`
        score,
        assessments ( id, title, max_score, type, date )
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
        subject: 'General',
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
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'report_card.ejs');
    const html = await ejs.renderFile(templatePath, {
      student: {
        name: `${student.first_name} ${student.last_name}`,
        id: student.admission_number,
        stream: student.class_streams?.name || 'N/A'
      },
      grades: processedGrades,
      summary: {
        average: finalPct.toFixed(1),
        grade: finalGrade.label
      },
      dateGenerated: new Date().toLocaleDateString()
    });

    // 5. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ] // Critical for server environments like Railway
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    
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
// GET Class Performance Analytics PDF
router.get('/analytics/class-performance/pdf', async (req: Request, res: Response): Promise<void> => {
  try {
    const streamId = req.query.streamId as string;
    
    let streamName = 'All Streams';
    if (streamId) {
      const { data: streamInfo } = await supabase.from('class_streams').select('name, code').eq('id', streamId).single();
      if (streamInfo) {
        streamName = `${streamInfo.name} (${streamInfo.code})`;
      }
    }

    let query = supabase.from('student_grades').select(`
      score,
      assessments ( id, title, max_score, type, date, stream_id ),
      students!inner ( id, first_name, last_name, stream_id )
    `);

    if (streamId) {
      query = query.eq('students.stream_id', streamId);
    }

    const { data: grades, error } = await query;
    if (error) throw error;

    let passed = 0;
    let failed = 0;
    
    const distribution: Record<string, number> = {};
    GRADING_SYSTEM.GRADES.forEach(g => {
      distribution[g.label] = 0;
    });

    let totalPct = 0;
    let totalAssessments = grades?.length || 0;
    
    grades?.forEach((g: any) => {
      const pct = (g.score / (g.assessments?.max_score || 100)) * 100;
      totalPct += pct;
      
      if (pct >= GRADING_SYSTEM.PASS_THRESHOLD) passed++;
      else failed++;

      const grade = getGradeFromPercentage(pct);
      distribution[grade.label]++;
    });

    const avgScore = grades && grades.length > 0 ? (totalPct / grades.length).toFixed(1) : 0;

    const templatePath = path.join(process.cwd(), 'src', 'templates', 'class_performance.ejs');
    const html = await ejs.renderFile(templatePath, {
      streamName,
      avgScore,
      passed,
      failed,
      totalAssessments,
      distribution,
      generatedDate: new Date().toLocaleDateString()
    });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ClassPerformanceAnalytics.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.end(pdfBuffer);

  } catch (err: any) {
    console.error("PDF Generation Error:", err);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

export default router;
