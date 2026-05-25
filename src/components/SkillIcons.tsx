"use client";

import { useState } from 'react';

interface SkillIconProps {
    name: string;
    className?: string;
}

/**
 * Converts a skill name to the Simple Icons CDN slug:
 *   "Next.js"   → "nextdotjs"
 *   "Node.js"   → "nodedotjs"
 *   "C++"       → "cplusplus"
 *   "Vue.js"    → "vuedotjs"
 *   "React"     → "react"
 *   "AWS"       → "amazonaws"  (special-cased below)
 */
function toSlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        // Replace ".js" suffix → "dotjs"
        .replace(/\.js$/i, 'dotjs')
        // Replace any remaining dots with "dot"
        .replace(/\./g, 'dot')
        // Replace "++" → "plusplus"
        .replace(/\+\+/g, 'plusplus')
        // Replace "#" → "sharp"
        .replace(/#/g, 'sharp')
        // Strip spaces & hyphens
        .replace(/[\s\-_]/g, '');
}

// Manual overrides for slugs that differ from the naive transformation
const SLUG_OVERRIDES: Record<string, string> = {
    'aws':          'amazonwebservices',
    'gcp':          'googlecloud',
    'google cloud': 'googlecloud',
    'postgres':     'postgresql',
    'mongo':        'mongodb',
    'k8s':          'kubernetes',
    'js':           'javascript',
    'ts':           'typescript',
    'golang':       'go',
};

function resolveSlug(name: string): string {
    const lower = name.trim().toLowerCase();
    // Check manual overrides first (exact or substring)
    for (const [key, val] of Object.entries(SLUG_OVERRIDES)) {
        if (lower === key || lower.includes(key)) return val;
    }
    return toSlug(name);
}

// Fallback </> icon in orange
function FallbackIcon({ className }: { className: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 18l6-6-6-6" />
            <path d="M8 6L2 12l6 6" />
        </svg>
    );
}

export default function SkillIcon({ name, className = 'skill-svg' }: SkillIconProps) {
    const [errored, setErrored] = useState(false);

    if (errored) return <FallbackIcon className={className} />;

    const slug = resolveSlug(name);
    const src = `https://cdn.simpleicons.org/${slug}`;

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
