"use client";

import { useState } from 'react';

interface SkillIconProps {
    name: string;
    className?: string;
}

// ─── Simple Icons slug + brand colour map ─────────────────────────────────────
// Keys are uppercase fragments that may appear in the skill name.
// Order matters: more specific entries first.
const ICON_MAP: Array<{ match: string[]; slug: string; color: string }> = [
    // Languages
    { match: ['TYPESCRIPT'],            slug: 'typescript',       color: '3178C6' },
    { match: ['JAVASCRIPT', 'JS'],      slug: 'javascript',       color: 'F7DF1E' },
    { match: ['PYTHON'],                slug: 'python',           color: '3776AB' },
    { match: ['JAVA'],                  slug: 'java',             color: 'ED8B00' },
    { match: ['KOTLIN'],                slug: 'kotlin',           color: '7F52FF' },
    { match: ['SWIFT'],                 slug: 'swift',            color: 'F05138' },
    { match: ['RUST'],                  slug: 'rust',             color: '000000' },
    { match: ['GO', 'GOLANG'],          slug: 'go',               color: '00ADD8' },
    { match: ['PHP'],                   slug: 'php',              color: '777BB4' },
    { match: ['RUBY'],                  slug: 'ruby',             color: 'CC342D' },
    { match: ['C++', 'CPP'],           slug: 'cplusplus',        color: '00599C' },
    { match: ['C#', 'CSHARP'],         slug: 'csharp',           color: '239120' },
    { match: ['SCALA'],                 slug: 'scala',            color: 'DC322F' },
    { match: ['ELIXIR'],               slug: 'elixir',           color: '4B275F' },
    { match: ['R'],                     slug: 'r',                color: '276DC3' },

    // Web – Frontend
    { match: ['HTML'],                  slug: 'html5',            color: 'E34F26' },
    { match: ['CSS'],                   slug: 'css3',             color: '1572B6' },
    { match: ['SASS', 'SCSS'],          slug: 'sass',             color: 'CC6699' },
    { match: ['TAILWIND'],             slug: 'tailwindcss',      color: '06B6D4' },
    { match: ['BOOTSTRAP'],            slug: 'bootstrap',        color: '7952B3' },
    { match: ['REACT'],                 slug: 'react',            color: '61DAFB' },
    { match: ['NEXT'],                  slug: 'nextdotjs',        color: '000000' },
    { match: ['VUE'],                   slug: 'vuedotjs',         color: '4FC08D' },
    { match: ['NUXT'],                  slug: 'nuxtdotjs',        color: '00DC82' },
    { match: ['ANGULAR'],              slug: 'angular',          color: 'DD0031' },
    { match: ['SVELTE'],               slug: 'svelte',           color: 'FF3E00' },
    { match: ['VITE'],                  slug: 'vite',             color: '646CFF' },
    { match: ['WEBPACK'],              slug: 'webpack',          color: '8DD6F9' },
    { match: ['ASTRO'],                slug: 'astro',            color: 'FF5D01' },
    { match: ['REMIX'],                slug: 'remix',            color: '000000' },
    { match: ['GATSBY'],               slug: 'gatsby',           color: '663399' },
    { match: ['THREE', 'THREEJS'],     slug: 'threedotjs',       color: '000000' },
    { match: ['FRAMER'],               slug: 'framer',           color: '0055FF' },

    // Backend / Runtime
    { match: ['NODE'],                  slug: 'nodedotjs',        color: '5FA04E' },
    { match: ['DENO'],                  slug: 'deno',             color: '70FFAF' },
    { match: ['EXPRESS'],              slug: 'express',          color: '000000' },
    { match: ['FASTAPI'],              slug: 'fastapi',          color: '009688' },
    { match: ['DJANGO'],               slug: 'django',           color: '092E20' },
    { match: ['FLASK'],                slug: 'flask',            color: '000000' },
    { match: ['SPRING'],               slug: 'spring',           color: '6DB33F' },
    { match: ['LARAVEL'],              slug: 'laravel',          color: 'FF2D20' },
    { match: ['RAILS', 'RUBY ON'],     slug: 'rubyonrails',      color: 'D30001' },
    { match: ['NESTJS', 'NEST.JS'],    slug: 'nestjs',           color: 'E0234E' },
    { match: ['GRAPHQL'],              slug: 'graphql',          color: 'E10098' },
    { match: ['TRPC'],                 slug: 'trpc',             color: '2596BE' },
    { match: ['GRPC'],                 slug: 'grpc',             color: '244C5A' },

    // Databases
    { match: ['POSTGRESQL', 'POSTGRES'], slug: 'postgresql',     color: '4169E1' },
    { match: ['MYSQL'],                slug: 'mysql',            color: '4479A1' },
    { match: ['MONGODB', 'MONGO'],     slug: 'mongodb',          color: '47A248' },
    { match: ['REDIS'],                slug: 'redis',            color: 'FF4438' },
    { match: ['SQLITE'],               slug: 'sqlite',           color: '003B57' },
    { match: ['SUPABASE'],             slug: 'supabase',         color: '3ECF8E' },
    { match: ['FIREBASE'],             slug: 'firebase',         color: 'DD2C00' },
    { match: ['PLANETSCALE'],          slug: 'planetscale',      color: '000000' },
    { match: ['COCKROACH'],            slug: 'cockroachlabs',    color: '6933FF' },
    { match: ['ELASTICSEARCH'],        slug: 'elasticsearch',    color: '005571' },
    { match: ['NEO4J'],                slug: 'neo4j',            color: '4581C3' },
    { match: ['CASSANDRA'],            slug: 'apachecassandra',  color: '1287B1' },
    { match: ['SQL'],                   slug: 'sqlite',           color: '003B57' },

    // DevOps / Cloud
    { match: ['DOCKER'],               slug: 'docker',           color: '2496ED' },
    { match: ['KUBERNETES', 'K8S'],    slug: 'kubernetes',       color: '326CE5' },
    { match: ['AWS', 'AMAZON WEB'],    slug: 'amazonwebservices', color: 'FF9900' },
    { match: ['GCP', 'GOOGLE CLOUD'],  slug: 'googlecloud',      color: '4285F4' },
    { match: ['AZURE'],                slug: 'microsoftazure',   color: '0078D4' },
    { match: ['VERCEL'],               slug: 'vercel',           color: '000000' },
    { match: ['NETLIFY'],              slug: 'netlify',          color: '00C7B7' },
    { match: ['HEROKU'],               slug: 'heroku',           color: '430098' },
    { match: ['CLOUDFLARE'],           slug: 'cloudflare',       color: 'F38020' },
    { match: ['TERRAFORM'],            slug: 'terraform',        color: '844FBA' },
    { match: ['ANSIBLE'],              slug: 'ansible',          color: 'EE0000' },
    { match: ['NGINX'],                slug: 'nginx',            color: '009639' },
    { match: ['LINUX'],                slug: 'linux',            color: 'FCC624' },
    { match: ['UBUNTU'],               slug: 'ubuntu',           color: 'E95420' },
    { match: ['GITHUB ACTIONS'],       slug: 'githubactions',    color: '2088FF' },
    { match: ['JENKINS'],              slug: 'jenkins',          color: 'D24939' },
    { match: ['GITLAB'],               slug: 'gitlab',           color: 'FC6D26' },

    // Tools / Other
    { match: ['GIT'],                  slug: 'git',              color: 'F05032' },
    { match: ['GITHUB'],               slug: 'github',           color: '181717' },
    { match: ['FIGMA'],                slug: 'figma',            color: 'F24E1E' },
    { match: ['POSTMAN'],              slug: 'postman',          color: 'FF6C37' },
    { match: ['PRISMA'],               slug: 'prisma',           color: '2D3748' },
    { match: ['DRIZZLE'],              slug: 'drizzle',          color: 'C5F74F' },
    { match: ['STRIPE'],               slug: 'stripe',           color: '635BFF' },
    { match: ['LANGCHAIN'],            slug: 'langchain',        color: '1C3C3C' },
    { match: ['OPENAI'],               slug: 'openai',           color: '000000' },
    { match: ['HUGGING'],              slug: 'huggingface',      color: 'FFD21E' },
    { match: ['TENSORFLOW'],           slug: 'tensorflow',       color: 'FF6F00' },
    { match: ['PYTORCH'],              slug: 'pytorch',          color: 'EE4C2C' },
    { match: ['PANDAS'],               slug: 'pandas',           color: '150458' },
    { match: ['STORYBOOK'],            slug: 'storybook',        color: 'FF4785' },
    { match: ['JEST'],                 slug: 'jest',             color: 'C21325' },
    { match: ['VITEST'],               slug: 'vitest',           color: '6E9F18' },
    { match: ['PLAYWRIGHT'],           slug: 'playwright',       color: '2EAD33' },
    { match: ['CYPRESS'],              slug: 'cypress',          color: '69D3A7' },
    { match: ['ELECTRON'],             slug: 'electron',         color: '47848F' },
    { match: ['TAURI'],                slug: 'tauri',            color: '24C8DB' },
    { match: ['EXPO'],                 slug: 'expo',             color: '000020' },
    { match: ['REACT NATIVE'],         slug: 'react',            color: '61DAFB' },
];

function resolveIcon(name: string): { slug: string; color: string } | null {
    const upper = name.trim().toUpperCase();
    for (const entry of ICON_MAP) {
        if (entry.match.some(fragment => upper.includes(fragment))) {
            return { slug: entry.slug, color: entry.color };
        }
    }
    return null;
}

// Fallback: generic code </> icon
function FallbackIcon({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="2">
            <path d="M16 18l6-6-6-6M8 6L2 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function SkillIcon({ name, className = 'skill-svg' }: SkillIconProps) {
    const [errored, setErrored] = useState(false);
    const resolved = resolveIcon(name);

    if (!resolved || errored) {
        return <FallbackIcon className={className} />;
    }

    const src = `https://cdn.simpleicons.org/${resolved.slug}/${resolved.color}`;

    return (
        <img
            src={src}
            alt={`${name} icon`}
            className={className}
            width={64}
            height={64}
            onError={() => setErrored(true)}
            style={{ objectFit: 'contain' }}
            loading="lazy"
        />
    );
}
