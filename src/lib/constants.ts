export interface ProjectItem {
    id: string;
    title: string;
    description: string;
    tech_stack: string;
    github_url?: string;
    live_url?: string;
    featured: boolean;
}

export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    type: 'Work' | 'Education';
}

export interface SkillItem {
    id: string;
    name: string;
    category: string;
}

export interface CertificationItem {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
    badge_image_url?: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
    {
        id: 'default-p1',
        title: 'NEXUS.OS',
        description: 'A high-performance collaborative dashboard for remote teams. Featuring real-time canvas editing, audio channels, and modular widget layouts.',
        tech_stack: 'Next.js, TypeScript, Tailwind, WebSockets',
        github_url: 'https://github.com/aryan/nexus-os',
        live_url: 'https://nexus-os.demo',
        featured: true
    },
    {
        id: 'default-p2',
        title: 'KRYPTON.DB',
        description: 'An open-source, lightweight distributed key-value store with an interactive web UI. Designed for ultra-low latency reads and active clustering replication.',
        tech_stack: 'Go, React, gRPC, Docker',
        github_url: 'https://github.com/aryan/krypton-db',
        live_url: 'https://kryptondb.io',
        featured: true
    },
    {
        id: 'default-p3',
        title: 'AURA.AI',
        description: 'A vector-based AI agent workspace integrating local model orchestrations and semantic code searches. Automates file analysis and unit test creation.',
        tech_stack: 'Node.js, PostgreSQL, LangChain, Vite',
        github_url: 'https://github.com/aryan/aura-ai',
        live_url: 'https://aura-ai.dev',
        featured: true
    }
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
    {
        id: 'default-e1',
        role: 'Lead Software Engineer',
        company: 'HYPERLOOP TECHNOLOGIES',
        period: '2024 - PRESENT',
        description: 'Architecting high-performance serverless endpoints and driving frontend modernization. Replaced legacy systems with a custom micro-frontend architecture using Next.js and Go, reducing page load times by 42%.',
        type: 'Work'
    },
    {
        id: 'default-e2',
        role: 'Senior Full Stack Engineer',
        company: 'BYTEFOOD PLATFORM',
        period: '2022 - 2024',
        description: 'Led the design and development of restaurant dashboards and scalable geofenced APIs. Structured a robust event-driven notification queue handling 1M+ active events per day using Node.js and Redis.',
        type: 'Work'
    },
    {
        id: 'default-e3',
        role: 'Full Stack Developer',
        company: 'PIXEL VENTURES',
        period: '2020 - 2022',
        description: 'Shipped 12+ client websites utilizing modern JAMstack structures, custom React state pipelines, and headless CMS integrations. Mentored 4 junior engineers on unit testing patterns.',
        type: 'Work'
    }
];

export const DEFAULT_SKILLS: SkillItem[] = [
    { id: 'default-s1', name: 'REACT', category: 'Frontend' },
    { id: 'default-s2', name: 'NEXT.JS', category: 'Frontend' },
    { id: 'default-s3', name: 'TYPESCRIPT', category: 'Languages' },
    { id: 'default-s4', name: 'NODE.JS', category: 'Backend' },
    { id: 'default-s5', name: 'POSTGRESQL', category: 'Databases' },
    { id: 'default-s6', name: 'DOCKER', category: 'Tools' }
];

export const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
    {
        id: 'default-c1',
        name: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024',
        url: 'https://aws.amazon.com'
    },
    {
        id: 'default-c2',
        name: 'Meta Frontend Developer',
        issuer: 'Meta',
        date: '2024',
        url: 'https://meta.com'
    },
    {
        id: 'default-c3',
        name: 'Google UX Design',
        issuer: 'Google',
        date: '2023',
        url: 'https://google.com'
    }
];
