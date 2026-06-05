-- Create the class_streams table
CREATE TABLE public.class_streams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) - For now, we allow all access as the backend will handle security
ALTER TABLE public.class_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated backend" 
ON public.class_streams 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert some initial seed data matching the designs
INSERT INTO public.class_streams (name, code, capacity) VALUES 
('Advanced Science A', 'sci-a', 40),
('Creative Arts B', 'art-b', 35),
('Business Admin C', 'bus-c', 45);
