"use client";

import { useState } from 'react';

interface SkillIconProps {
    name: string;
    className?: string;
}

const DEVICONS = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

// ── Per-skill URL chain (tried in order, falls through to </> if all fail) ──
// Keys are uppercase fragments matched against the skill name.
const URL_CHAINS: Array<{ match: string[]; urls: string[] }> = [
    {
        match: ['CSS'],
        urls: [
            'https://cdn.simpleicons.org/css3/1572B6',
            `${DEVICONS}/css3/css3-original.svg`,
        ],
    },
    {
        match: ['HTML'],
        urls: [
            'https://cdn.simpleicons.org/html5/E34F26',
            `${DEVICONS}/html5/html5-original.svg`,
        ],
    },
    {
        // openjdk slug shows Linux penguin — use devicons directly
        match: ['JAVA'],
        urls: [
            `${DEVICONS}/java/java-original.svg`,
        ],
    },
    {
        match: ['PYTHON'],
        urls: [
            'https://cdn.simpleicons.org/python/3776AB',
            `${DEVICONS}/python/python-original.svg`,
        ],
    },
    {
        match: ['JAVASCRIPT', ' JS'],
        urls: [
            'https://cdn.simpleicons.org/javascript/F7DF1E',
            `${DEVICONS}/javascript/javascript-original.svg`,
        ],
    },
    {
        match: ['TYPESCRIPT', 'TS'],
        urls: [
            'https://cdn.simpleicons.org/typescript/3178C6',
            `${DEVICONS}/typescript/typescript-original.svg`,
        ],
    },
    {
        match: ['REACT'],
        urls: [
            'https://cdn.simpleicons.org/react/61DAFB',
            `${DEVICONS}/react/react-original.svg`,
        ],
    },
    {
        match: ['NODE'],
        urls: [
            'https://cdn.simpleicons.org/nodedotjs/5FA04E',
            `${DEVICONS}/nodejs/nodejs-original.svg`,
        ],
    },
    {
        match: ['DOCKER'],
        urls: [
            'https://cdn.simpleicons.org/docker/2496ED',
            `${DEVICONS}/docker/docker-original.svg`,
        ],
    },
    {
        match: ['AWS', 'AMAZON'],
        urls: [
            'https://cdn.simpleicons.org/amazonaws/FF9900',
        ],
    },
    {
        match: ['GIT'],
        urls: [
            'https://cdn.simpleicons.org/git/F05032',
            `${DEVICONS}/git/git-original.svg`,
        ],
    },
    {
        match: ['SQL', 'MYSQL'],
        urls: [
            'https://cdn.simpleicons.org/mysql/4479A1',
            `${DEVICONS}/mysql/mysql-original.svg`,
        ],
    },
    {
        match: ['POSTGRESQL', 'POSTGRES'],
        urls: [
            'https://cdn.simpleicons.org/postgresql/4169E1',
            `${DEVICONS}/postgresql/postgresql-original.svg`,
        ],
    },
    {
        match: ['NEXT'],
        urls: [
            'https://cdn.simpleicons.org/nextdotjs/000000',
            `${DEVICONS}/nextjs/nextjs-original.svg`,
        ],
    },
    {
        match: ['VUE'],
        urls: [
            'https://cdn.simpleicons.org/vuedotjs/4FC08D',
            `${DEVICONS}/vuejs/vuejs-original.svg`,
        ],
    },
    {
        match: ['ANGULAR'],
        urls: [
            'https://cdn.simpleicons.org/angular/DD0031',
            `${DEVICONS}/angularjs/angularjs-original.svg`,
        ],
    },
    {
        match: ['MONGODB', 'MONGO'],
        urls: [
            'https://cdn.simpleicons.org/mongodb/47A248',
            `${DEVICONS}/mongodb/mongodb-original.svg`,
        ],
    },
    {
        match: ['REDIS'],
        urls: [
            'https://cdn.simpleicons.org/redis/FF4438',
            `${DEVICONS}/redis/redis-original.svg`,
        ],
    },
    {
        match: ['KUBERNETES', 'K8S'],
        urls: [
            'https://cdn.simpleicons.org/kubernetes/326CE5',
            `${DEVICONS}/kubernetes/kubernetes-plain.svg`,
        ],
    },
    {
        match: ['LINUX'],
        urls: [
            'https://cdn.simpleicons.org/linux/FCC624',
            `${DEVICONS}/linux/linux-original.svg`,
        ],
    },
    {
        match: ['GITHUB'],
        urls: ['https://cdn.simpleicons.org/github/181717'],
    },
    {
        match: ['FIGMA'],
        urls: [
            'https://cdn.simpleicons.org/figma/F24E1E',
            `${DEVICONS}/figma/figma-original.svg`,
        ],
    },
    {
        match: ['RUST'],
        urls: ['https://cdn.simpleicons.org/rust/000000'],
    },
    {
        match: ['GO', 'GOLANG'],
        urls: [
            'https://cdn.simpleicons.org/go/00ADD8',
            `${DEVICONS}/go/go-original.svg`,
        ],
    },
    {
        match: ['KOTLIN'],
        urls: [
            'https://cdn.simpleicons.org/kotlin/7F52FF',
            `${DEVICONS}/kotlin/kotlin-original.svg`,
        ],
    },
    {
        match: ['SWIFT'],
        urls: [
            'https://cdn.simpleicons.org/swift/F05138',
            `${DEVICONS}/swift/swift-original.svg`,
        ],
    },
    {
        match: ['PHP'],
        urls: [
            'https://cdn.simpleicons.org/php/777BB4',
            `${DEVICONS}/php/php-original.svg`,
        ],
    },
    {
        match: ['FLUTTER'],
        urls: [
            'https://cdn.simpleicons.org/flutter/02569B',
            `${DEVICONS}/flutter/flutter-original.svg`,
        ],
    },
    {
        match: ['DJANGO'],
        urls: [
            'https://cdn.simpleicons.org/django/092E20',
            `${DEVICONS}/django/django-plain.svg`,
        ],
    },
    {
        match: ['SUPABASE'],
        urls: ['https://cdn.simpleicons.org/supabase/3ECF8E'],
    },
    {
        match: ['FIREBASE'],
        urls: ['https://cdn.simpleicons.org/firebase/DD2C00'],
    },
    {
        match: ['TAILWIND'],
        urls: ['https://cdn.simpleicons.org/tailwindcss/06B6D4'],
    },
    {
        match: ['STRIPE'],
        urls: ['https://cdn.simpleicons.org/stripe/635BFF'],
    },
    {
        match: ['GRAPHQL'],
        urls: ['https://cdn.simpleicons.org/graphql/E10098'],
    },
    {
        match: ['PRISMA'],
        urls: ['https://cdn.simpleicons.org/prisma/2D3748'],
    },
    {
        match: ['VITE'],
        urls: ['https://cdn.simpleicons.org/vite/646CFF'],
    },
    {
        match: ['JEST'],
        urls: ['https://cdn.simpleicons.org/jest/C21325'],
    },
    {
        match: ['VERCEL'],
        urls: ['https://cdn.simpleicons.org/vercel/000000'],
    },
    {
        match: ['NETLIFY'],
        urls: ['https://cdn.simpleicons.org/netlify/00C7B7'],
    },
    {
        match: ['NGINX'],
        urls: ['https://cdn.simpleicons.org/nginx/009639'],
    },
    {
        match: ['TERRAFORM'],
        urls: ['https://cdn.simpleicons.org/terraform/844FBA'],
    },
    {
        match: ['OPENAI'],
        urls: ['https://cdn.simpleicons.org/openai/000000'],
    },
];

/** Find the URL chain for a skill name, or build a single-entry auto-slug chain */
function resolveUrls(name: string): string[] {
    const upper = name.trim().toUpperCase();
    for (const entry of URL_CHAINS) {
        if (entry.match.some(f => upper.includes(f.trim()))) return entry.urls;
    }
    // Auto-slug fallback for anything not in the map
    const slug = name
        .trim()
        .toLowerCase()
        .replace(/\.js$/i, 'dotjs')
        .replace(/\./g, 'dot')
        .replace(/\+\+/g, 'plusplus')
        .replace(/#/g, 'sharp')
        .replace(/[\s\-_]/g, '');
    return [`https://cdn.simpleicons.org/${slug}`];
}

// </> fallback rendered when all URLs are exhausted
function FallbackIcon({ className }: { className: string }) {
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

export default function SkillIcon({ name, className = 'skill-svg' }: SkillIconProps) {
    const [urlIndex, setUrlIndex] = useState(0);
    const urls = resolveUrls(name);

    if (urlIndex >= urls.length) {
        return <FallbackIcon className={className} />;
    }

    return (
        <img
            src={urls[urlIndex]}
            alt={`${name} icon`}
            className={className}
            width={64}
            height={64}
            loading="lazy"
            style={{ objectFit: 'contain', display: 'block' }}
            onError={() => setUrlIndex(i => i + 1)}
        />
    );
}
