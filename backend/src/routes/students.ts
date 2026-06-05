import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET all students
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Join with class_streams to get the stream name
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class_streams (
          id,
          name,
          code
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single student
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class_streams (id, name, code)
      `)
      .eq('id', req.params.id)
      .single();
      
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, admission_number, stream_id, dob } = req.body;
    const { data, error } = await supabase
      .from('students')
      .insert([{ first_name, last_name, admission_number, stream_id, dob }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
