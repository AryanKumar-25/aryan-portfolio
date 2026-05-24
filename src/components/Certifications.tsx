"use client";

import { CertificationItem } from '@/lib/constants';

interface CertificationsProps {
    certifications: CertificationItem[];
}

// Inline custom vector logos matching the issuer brand
function CertBadgeIcon({ issuer }: { issuer: string }) {
    const normIssuer = issuer.trim().toUpperCase();

    // 1. AWS LOGO
    if (normIssuer.includes('AMAZON') || normIssuer.includes('AWS')) {
        return (
            <svg className="cert-badge-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9z" fill="#FFE6DB" stroke="#0F172A" strokeWidth="2" />
                <path d="M8 14s2 2 4 2 4-2 4-2" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 11.5l1.5 2.5-2.5 1" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 8.5c-.8 0-1.5.5-1.5 1.2 0 1 .8 1.3 1.8 1.3.8 0 1.2-.2 1.2-.2V9.5c0-.6-.4-1-1.5-1z" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        );
    }

    // 2. META LOGO
    if (normIssuer.includes('META') || normIssuer.includes('FACEBOOK')) {
        return (
            <svg className="cert-badge-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9z" fill="#E6F2FF" stroke="#0F172A" strokeWidth="2" />
                <path d="M7 12c0-1.8 1.2-3 2.8-3 1 0 1.8.5 2.2 1.2.4-.7 1.2-1.2 2.2-1.2 1.6 0 2.8 1.2 2.8 3s-1.2 3-2.8 3c-1 0-1.8-.5-2.2-1.2-.4.7-1.2 1.2-2.2 1.2C8.2 15 7 13.8 7 12z" stroke="#007F3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    // 3. GOOGLE LOGO
    if (normIssuer.includes('GOOGLE')) {
        return (
            <svg className="cert-badge-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9z" fill="#FFF3CD" stroke="#0F172A" strokeWidth="2" />
                <path d="M16 12.2c0-.3 0-.6-.1-.9H12v1.8h2.3c-.1.5-.4 1-.8 1.3v1.1h1.3c.7-.7 1.2-1.8 1.2-3.3z" fill="#0F172A" />
                <path d="M12 16.2c1.1 0 2-.4 2.7-1l-1.3-1.1c-.4.3-.8.4-1.4.4-1 0-1.9-.7-2.2-1.7H8.5v1.1c.7 1.4 2.1 2.3 3.5 2.3z" fill="#0F172A" />
            </svg>
        );
    }

    // 4. GENERIC CERTIFICATE LOGO FALLBACK
    return (
        <svg className="cert-badge-icon" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAEAEA" />
            <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
        </svg>
    );
}

export default function Certifications({ certifications }: CertificationsProps) {
    const handleConfetti = (e: React.MouseEvent) => {
        if (window.triggerConfetti) {
            window.triggerConfetti(e.clientX, e.clientY);
        }
    };

    return (
        <section id="certifications" className="container">
            <div className="section-header reveal active">
                <span className="section-label" style={{ color: 'var(--color-orange)' }}>// 05 — CERTIFICATIONS</span>
                <h2 className="section-title">
                    CERTIFIED & <br />
                    <span style={{ color: 'transparent', WebkitTextStroke: '3px var(--color-navy)' }}>
                        VERIFIED.
                    </span>
                </h2>
            </div>

            <div className="cert-grid">
                {certifications.map((cert, index) => (
                    <div 
                        key={cert.id} 
                        className="cert-card reveal active"
                        style={{ transitionDelay: `${index * 0.15}s` }}
                    >
                        <div>
                            {/* Square, with border badge logo */}
                            <div className="cert-badge-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {cert.badge_image_url ? (
                                    <img 
                                        src={cert.badge_image_url} 
                                        alt={`${cert.issuer} Badge`} 
                                        className="cert-badge-icon" 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                    />
                                ) : (
                                    <CertBadgeIcon issuer={cert.issuer} />
                                )}
                            </div>

                            {/* Certificate name - Cabinet Grotesk bold uppercase */}
                            <h3 className="cert-name">{cert.name.toUpperCase()}</h3>

                            {/* Issuer name - orange JetBrains Mono */}
                            <div className="cert-issuer">{cert.issuer}</div>

                            {/* Date issued - muted monospace text */}
                            <div className="cert-date">ISSUED: {cert.date}</div>
                        </div>
                        
                        {/* View Credential button linking to certificate URL */}
                        {cert.url && (
                            <a 
                                href={cert.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn cert-btn"
                                onClick={handleConfetti}
                            >
                                VIEW CREDENTIAL
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
