-- Create subjects table
CREATE TABLE public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    department TEXT,
    credits NUMERIC(3,1) DEFAULT 3.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subject_assignments table (junction table to assign subjects to class streams)
CREATE TABLE public.subject_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    stream_id UUID REFERENCES public.class_streams(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(subject_id, stream_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated backend on subjects" 
ON public.subjects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated backend on subject_assignments" 
ON public.subject_assignments FOR ALL USING (true) WITH CHECK (true);
