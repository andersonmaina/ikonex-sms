-- Add status column to students table
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
