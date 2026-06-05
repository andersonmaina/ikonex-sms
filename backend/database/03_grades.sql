-- Create assessments table
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Midterm', 'Final', 'Quiz'
    max_score INTEGER DEFAULT 100,
    stream_id UUID REFERENCES public.class_streams(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create student_grades table
CREATE TABLE public.student_grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, assessment_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated backend on assessments" 
ON public.assessments FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated backend on student_grades" 
ON public.student_grades FOR ALL USING (true) WITH CHECK (true);
