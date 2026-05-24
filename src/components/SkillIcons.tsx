"use client";

interface SkillIconProps {
    name: string;
    className?: string;
}

export default function SkillIcon({ name, className = "skill-svg" }: SkillIconProps) {
    const normName = name.trim().toUpperCase();

    // 1. REACT ICON
    if (normName.includes('REACT')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2">
                <circle cx="12" cy="12" r="2" />
                <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(30 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(90 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(150 12 12)" />
            </svg>
        );
    }

    // 2. NEXT.JS ICON
    if (normName.includes('NEXT')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 17V9l6 8V9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    // 3. TYPESCRIPT / JAVASCRIPT ICON
    if (normName.includes('TYPESCRIPT') || normName.includes('TS') || normName.includes('JS') || normName.includes('JAVASCRIPT')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 9v6h2" strokeLinecap="round" />
                <path d="M18 10c0-1-1-1.5-2-1.5s-2 .5-2 1.5.5 1 2 1.5 2 .5 2 1.5-.5 1.5-2 1.5-2-.5-2-1.5" strokeLinecap="round" />
            </svg>
        );
    }

    // 4. NODE.JS ICON
    if (normName.includes('NODE')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12" strokeLinecap="round" />
                <path d="M12 12l8-5" strokeLinecap="round" />
                <path d="M12 12L4 7" strokeLinecap="round" />
            </svg>
        );
    }

    // 5. POSTGRESQL / SQL / DATABASE ICON
    if (normName.includes('POSTGRES') || normName.includes('SQL') || normName.includes('DB') || normName.includes('DATABASE')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
            </svg>
        );
    }

    // 6. DOCKER / DEVOPS ICON
    if (normName.includes('DOCKER') || normName.includes('CONTAINER')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                <rect x="2" y="14" width="20" height="6" rx="1" />
                <rect x="4" y="8" width="4" height="4" rx="0.5" />
                <rect x="10" y="8" width="4" height="4" rx="0.5" />
                <rect x="16" y="8" width="4" height="4" rx="0.5" />
                <rect x="7" y="3" width="4" height="4" rx="0.5" />
            </svg>
        );
    }

    // 7. GO / GOLANG ICON
    if (normName.includes('GO') || normName.includes('GOLANG')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#00ADD8" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4" strokeLinecap="round" />
                <path d="M15 12h-4" strokeLinecap="round" />
            </svg>
        );
    }

    // DEFAULT MONOSPACE CODE TAG FALLBACK
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="2">
            <path d="M16 18l6-6-6-6M8 6L2 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
