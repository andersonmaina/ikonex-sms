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

// GET assessments
router.get('/assessments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*, class_streams(name, code)')
      .order('date', { ascending: false });
    
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new assessment
router.post('/assessments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, max_score, stream_id, date } = req.body;
    const { data, error } = await supabase
      .from('assessments')
      .insert([{ title, type, max_score, stream_id, date }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET scores for a specific assessment
router.get('/assessments/:id/scores', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('student_grades')
      .select('*')
      .eq('assessment_id', req.params.id);
      
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST grade
router.post('/scores', async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, assessment_id, score } = req.body;
    
    // Upsert the score (insert or update)
    const { data, error } = await supabase
      .from('student_grades')
      .upsert({ student_id, assessment_id, score }, { onConflict: 'student_id,assessment_id' })
      .select()
      .single();
      
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
