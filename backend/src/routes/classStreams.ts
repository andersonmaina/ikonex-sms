import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET all class streams
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('class_streams')
      .select('*')
      .order('name');
    
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single class stream
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('class_streams')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new class stream
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, capacity } = req.body;
    const { data, error } = await supabase
      .from('class_streams')
      .insert([{ name, code, capacity }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
