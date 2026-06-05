import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET a student's profile including grades and stream details
router.get('/student/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.params.id;

    // Fetch the student
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`
        *,
        class_streams (id, name, code)
      `)
      .eq('id', studentId)
      .single();

    if (studentError) throw studentError;

    // Fetch the grades for this student
    const { data: grades, error: gradesError } = await supabase
      .from('student_grades')
      .select(`
        id,
        score,
        assessments (id, title, type, max_score, date)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (gradesError) throw gradesError;

    res.json({ data: { student, grades } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
