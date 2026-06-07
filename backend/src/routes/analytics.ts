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

    // 3. Total Subjects
    const { count: subjectCount, error: err3 } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true });
    if (err3) throw err3;

    res.json({
      data: {
        totalStudents: studentCount || 0,
        activeStreams: streamCount || 0,
        totalSubjects: subjectCount || 0
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
    
    // In a real app we'd filter by streamId, but for now we aggregate broadly or specific if provided
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

    // Calculate stats using weighted average: sum(scores) / sum(max_scores)
    let passed = 0;
    let failed = 0;
    let totalScore = 0;
    let totalMax = 0;
    
    const distribution: Record<string, number> = {};
    GRADING_SYSTEM.GRADES.forEach(g => {
      distribution[g.label] = 0;
    });

    grades?.forEach((g: any) => {
      const score = g.score;
      const max = g.assessments?.max_score || 100;
      const pct = (score / max) * 100;
      totalScore += score;
      totalMax += max;

      if (pct >= GRADING_SYSTEM.PASS_THRESHOLD) passed++;
      else failed++;

      const grade = getGradeFromPercentage(pct);
      distribution[grade.label]++;
    });

    const avgScore = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : 0;

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
