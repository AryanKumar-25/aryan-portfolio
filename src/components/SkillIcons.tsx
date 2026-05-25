"use client";

import { useState } from 'react';

interface SkillIconProps {
    name: string;
    className?: string;
}

// ── Explicit slug overrides (highest priority) ──────────────────────────────
// Maps uppercased skill name fragments → exact Simple Icons slug
const SLUG_MAP: Array<{ match: string[]; slug: string }> = [
    // Explicit overrides first
    { match: ['HTML'],                      slug: 'html5' },
    { match: ['CSS'],                       slug: 'css3' },
    { match: ['JAVA'],                      slug: 'openjdk' },
    { match: ['SQL', 'MYSQL'],              slug: 'mysql' },
    { match: ['POSTGRESQL', 'POSTGRES'],    slug: 'postgresql' },
    { match: ['PYTHON'],                    slug: 'python' },
    { match: ['JAVASCRIPT', 'JS'],         slug: 'javascript' },
    { match: ['TYPESCRIPT', 'TS'],         slug: 'typescript' },
    { match: ['REACT'],                     slug: 'react' },
    { match: ['NODE'],                      slug: 'nodedotjs' },
    { match: ['DOCKER'],                    slug: 'docker' },
    { match: ['AWS', 'AMAZON'],            slug: 'amazonaws' },
    { match: ['GIT'],                       slug: 'git' },
    // Common extras
    { match: ['NEXT'],                      slug: 'nextdotjs' },
    { match: ['VUE'],                       slug: 'vuedotjs' },
    { match: ['NUXT'],                      slug: 'nuxtdotjs' },
    { match: ['ANGULAR'],                   slug: 'angular' },
    { match: ['SVELTE'],                    slug: 'svelte' },
    { match: ['TAILWIND'],                  slug: 'tailwindcss' },
    { match: ['SASS', 'SCSS'],             slug: 'sass' },
    { match: ['BOOTSTRAP'],                slug: 'bootstrap' },
    { match: ['GRAPHQL'],                   slug: 'graphql' },
    { match: ['MONGODB', 'MONGO'],         slug: 'mongodb' },
    { match: ['REDIS'],                     slug: 'redis' },
    { match: ['FIREBASE'],                  slug: 'firebase' },
    { match: ['SUPABASE'],                  slug: 'supabase' },
    { match: ['KUBERNETES', 'K8S'],        slug: 'kubernetes' },
    { match: ['AZURE'],                     slug: 'microsoftazure' },
    { match: ['GCP', 'GOOGLE CLOUD'],      slug: 'googlecloud' },
    { match: ['LINUX'],                     slug: 'linux' },
    { match: ['GITHUB'],                    slug: 'github' },
    { match: ['GITLAB'],                    slug: 'gitlab' },
    { match: ['FIGMA'],                     slug: 'figma' },
    { match: ['RUST'],                      slug: 'rust' },
    { match: ['GO', 'GOLANG'],             slug: 'go' },
    { match: ['KOTLIN'],                    slug: 'kotlin' },
    { match: ['SWIFT'],                     slug: 'swift' },
    { match: ['PHP'],                       slug: 'php' },
    { match: ['RUBY'],                      slug: 'ruby' },
    { match: ['C++', 'CPP'],              slug: 'cplusplus' },
    { match: ['C#', 'CSHARP'],            slug: 'csharp' },
    { match: ['FLUTTER'],                   slug: 'flutter' },
    { match: ['DJANGO'],                    slug: 'django' },
    { match: ['FLASK'],                     slug: 'flask' },
    { match: ['FASTAPI'],                   slug: 'fastapi' },
    { match: ['SPRING'],                    slug: 'spring' },
    { match: ['EXPRESS'],                   slug: 'express' },
    { match: ['NESTJS', 'NEST.JS'],        slug: 'nestjs' },
    { match: ['PRISMA'],                    slug: 'prisma' },
    { match: ['STRIPE'],                    slug: 'stripe' },
    { match: ['VERCEL'],                    slug: 'vercel' },
    { match: ['NETLIFY'],                   slug: 'netlify' },
    { match: ['TERRAFORM'],                 slug: 'terraform' },
    { match: ['JEST'],                      slug: 'jest' },
    { match: ['VITE'],                      slug: 'vite' },
    { match: ['WEBPACK'],                   slug: 'webpack' },
    { match: ['POSTMAN'],                   slug: 'postman' },
    { match: ['NGINX'],                     slug: 'nginx' },
    { match: ['ELASTICSEARCH'],             slug: 'elasticsearch' },
    { match: ['SQLITE'],                    slug: 'sqlite' },
    { match: ['OPENAI'],                    slug: 'openai' },
    { match: ['TENSORFLOW'],               slug: 'tensorflow' },
    { match: ['PYTORCH'],                   slug: 'pytorch' },
];

/** Check explicit map first; fall back to naive slugification */
function resolveSlug(name: string): string {
    const upper = name.trim().toUpperCase();
    for (const entry of SLUG_MAP) {
        if (entry.match.some(f => upper.includes(f))) return entry.slug;
    }
    // Naive auto-slug: lowercase, .js→dotjs, spaces/hyphens stripped
    return name
        .trim()
        .toLowerCase()
        .replace(/\.js$/i, 'dotjs')
        .replace(/\./g, 'dot')
        .replace(/\+\+/g, 'plusplus')
        .replace(/#/g, 'sharp')
        .replace(/[\s\-_]/g, '');
}

export default function SkillIcon({ name, className = 'skill-svg' }: SkillIconProps) {
    const [errored, setErrored] = useState(false);
    const slug = resolveSlug(name);
    const src = `https://cdn.simpleicons.org/${slug}`;

    if (errored) {
        return (
            <span
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: '22px',
                    color: '#FF6B35',
                    userSelect: 'none',
                }}
            >
                {'</>'}
            </span>
        );
    }

    return (
        <img
            src={src}
            alt={`${name} icon`}
            className={className}
            width={64}
            height={64}
            loading="lazy"
            style={{ objectFit: 'contain', display: 'block' }}
            onError={() => setErrored(true)}
        />
    );
}
