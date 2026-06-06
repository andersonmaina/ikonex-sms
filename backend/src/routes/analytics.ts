import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { GRADING_SYSTEM, getGradeFromPercentage } from '../utils/constants';

const router = Router();

// GET School Overview (for Dashboard)
router.get('/overview', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Total Students
    const { count: studentCount, error: err1 } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    if (err1) throw err1;

    // 2. Active Streams
    const { count: streamCount, error: err2 } = await supabase
      .from('class_streams')
      .select('*', { count: 'exact', head: true });
    if (err2) throw err2;

    // 3. Average GPA proxy (average of all scores)
    const { data: scores, error: err3 } = await supabase
      .from('student_grades')
      .select('score, assessments(max_score)');
    if (err3) throw err3;

    let totalScore = 0;
    let totalMax = 0;
    scores?.forEach((g: any) => {
      totalScore += Number(g.score);
      totalMax += Number(g.assessments?.max_score || 100);
    });

    // Calculate a rough GPA out of 4.0 based on percentage
    const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    
    // Use our new constants to get the precise GPA value for the school average!
    const gradeObj = getGradeFromPercentage(percentage);
    const avgGPA = totalMax > 0 ? gradeObj.gpaValue.toFixed(1) : "0.0";

    res.json({
      data: {
        totalStudents: studentCount || 0,
        activeStreams: streamCount || 0,
        averageGPA: avgGPA
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Class Performance Analytics
router.get('/class-performance', async (req: Request, res: Response): Promise<void> => {
  try {
    const streamId = req.query.streamId as string;
    const subjectId = req.query.subjectId as string;
    
    // In a real app we'd filter by streamId, but for now we aggregate broadly or specific if provided
    let query = supabase.from('student_grades').select(`
      score,
      assessments!inner ( id, title, max_score, type, date, stream_id, subject_id ),
      students!inner ( id, first_name, last_name, stream_id )
    `);

    if (streamId) {
      query = query.eq('students.stream_id', streamId);
    }
    if (subjectId) {
      query = query.eq('assessments.subject_id', subjectId);
    }

    const { data: grades, error } = await query;
    if (error) throw error;

    // Calculate stats
    let passed = 0;
    let failed = 0;
    
    // Dynamically initialize distribution based on constants
    const distribution: Record<string, number> = {};
    GRADING_SYSTEM.GRADES.forEach(g => {
      distribution[g.label] = 0;
    });

    let totalPct = 0;
    
    grades?.forEach((g: any) => {
      const pct = (g.score / (g.assessments?.max_score || 100)) * 100;
      totalPct += pct;
      
      // Determine Pass/Fail from constants
      if (pct >= GRADING_SYSTEM.PASS_THRESHOLD) passed++;
      else failed++;

      // Determine Letter Grade dynamically
      const grade = getGradeFromPercentage(pct);
      distribution[grade.label]++;
    });

    const avgScore = grades && grades.length > 0 ? (totalPct / grades.length).toFixed(1) : 0;

    res.json({
      data: {
        totalAssessments: new Set(grades?.map((g: any) => g.assessments?.id)).size,
        avgScore,
        passed,
        failed,
        distribution,
        gradingSystem: GRADING_SYSTEM.GRADES // We send this to frontend to map dynamically
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
