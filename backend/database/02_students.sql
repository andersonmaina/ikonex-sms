-- Create the students table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    admission_number TEXT NOT NULL UNIQUE,
    stream_id UUID REFERENCES public.class_streams(id) ON DELETE SET NULL,
    dob DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated backend on students" 
ON public.students 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Note: We won't insert dummy students here automatically because they need to reference 
-- real stream_id UUIDs from the class_streams table, which are dynamically generated.
