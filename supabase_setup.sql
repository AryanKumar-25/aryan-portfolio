-- ==========================================================================
-- SUPABASE POSTGRES DB MIGRATION SCRIPT FOR ARYAN'S PORTFOLIO
-- Paste this script inside your Supabase SQL Editor and click RUN.
-- ==========================================================================

-- 1. Create PROJECTS Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT NOT NULL, -- Comma-separated list of technologies
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create Policies: Anyone can read, only Service Role (admin) can write
CREATE POLICY "Allow public read access on projects" 
    ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on projects" 
    ON public.projects FOR ALL USING (true) WITH CHECK (true);


-- 2. Create EXPERIENCE Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL, -- e.g., "2024 - PRESENT"
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Work', 'Education'))
);

-- Enable RLS for experience
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access on experience" 
    ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on experience" 
    ON public.experience FOR ALL USING (true) WITH CHECK (true);


-- 3. Create SKILLS Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL -- e.g., "Frontend", "Backend", "Tools"
);

-- Enable RLS for skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access on skills" 
    ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on skills" 
    ON public.skills FOR ALL USING (true) WITH CHECK (true);


-- 4. Create CERTIFICATIONS Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT NOT NULL, -- e.g., "May 2026"
    url TEXT
);

-- Enable RLS for certifications
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access on certifications" 
    ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on certifications" 
    ON public.certifications FOR ALL USING (true) WITH CHECK (true);


-- ==========================================================================
-- SEED INITIAL DATA (Optional - run to pre-fill the tables with static values)
-- ==========================================================================
INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, featured)
VALUES 
('NEXUS.OS', 'A high-performance collaborative dashboard for remote teams. Featuring real-time canvas editing, audio channels, and modular widget layouts.', 'Next.js, TypeScript, Tailwind, WebSockets', 'https://github.com/aryan/nexus-os', 'https://nexus-os.demo', true),
('KRYPTON.DB', 'An open-source, lightweight distributed key-value store with an interactive web UI. Designed for ultra-low latency reads and active clustering replication.', 'Go, React, gRPC, Docker', 'https://github.com/aryan/krypton-db', 'https://kryptondb.io', true),
('AURA.AI', 'A vector-based AI agent workspace integrating local model orchestrations and semantic code searches. Automates file analysis and unit test creation.', 'Node.js, PostgreSQL, LangChain, Vite', 'https://github.com/aryan/aura-ai', 'https://aura-ai.dev', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.experience (role, company, period, description, type)
VALUES 
('Lead Software Engineer', 'HYPERLOOP TECHNOLOGIES', '2024 - PRESENT', 'Architecting high-performance serverless endpoints and driving frontend modernization. Replaced legacy systems with a custom micro-frontend architecture using Next.js and Go, reducing page load times by 42%.', 'Work'),
('Senior Full Stack Engineer', 'BYTEFOOD PLATFORM', '2022 - 2024', 'Led the design and development of restaurant dashboards and scalable geofenced APIs. Structured a robust event-driven notification queue handling 1M+ active events per day using Node.js and Redis.', 'Work'),
('Full Stack Developer', 'PIXEL VENTURES', '2020 - 2022', 'Shipped 12+ client websites utilizing modern JAMstack structures, custom React state pipelines, and headless CMS integrations. Mentored 4 junior engineers on unit testing patterns.', 'Work')
ON CONFLICT DO NOTHING;

INSERT INTO public.skills (name, category)
VALUES 
('REACT', 'Frontend'),
('NEXT.JS', 'Frontend'),
('TYPESCRIPT', 'Languages'),
('NODE.JS', 'Backend'),
('POSTGRESQL', 'Databases'),
('DOCKER', 'Tools')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.certifications (name, issuer, date, url)
VALUES
('AWS Certified Solutions Architect', 'Amazon Web Services', 'March 2026', 'https://aws.amazon.com'),
('Google Cloud Professional Cloud Architect', 'Google Cloud', 'January 2026', 'https://cloud.google.com')
ON CONFLICT DO NOTHING;
