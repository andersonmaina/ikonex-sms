import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET all subjects with their assignments
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        subject_assignments (
          id,
          class_streams (id, name, code)
        )
      `)
      .order('name');
    
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST new subject
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, department, credits, stream_ids, exam_type } = req.body;
    
    // 1. Insert Subject
    const { data: newSubject, error: subjectError } = await supabase
      .from('subjects')
      .insert([{ name, code, department, credits, exam_type: exam_type || 'Both' }])
      .select()
      .single();
      
    if (subjectError) throw subjectError;

    // 2. Assign to streams if provided
    if (stream_ids && Array.isArray(stream_ids) && stream_ids.length > 0) {
      const assignments = stream_ids.map(streamId => ({
        subject_id: newSubject.id,
        stream_id: streamId
      }));

      const { error: assignError } = await supabase
        .from('subject_assignments')
        .insert(assignments);

      if (assignError) throw assignError;
    }

    res.status(201).json({ data: newSubject });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update subject
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, department, credits, stream_ids, exam_type } = req.body;
    
    // 1. Update Subject
    const { data: updatedSubject, error: subjectError } = await supabase
      .from('subjects')
      .update({ name, code, department, credits, exam_type })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (subjectError) throw subjectError;

    // 2. Re-assign streams if provided (delete old, insert new)
    if (stream_ids && Array.isArray(stream_ids)) {
      await supabase.from('subject_assignments').delete().eq('subject_id', req.params.id);
      
      if (stream_ids.length > 0) {
        const assignments = stream_ids.map(streamId => ({
          subject_id: req.params.id,
          stream_id: streamId
        }));
        const { error: assignError } = await supabase.from('subject_assignments').insert(assignments);
        if (assignError) throw assignError;
      }
    }

    res.json({ data: updatedSubject });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE subject
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
