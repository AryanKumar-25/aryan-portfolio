"use client";

import { useState } from 'react';

interface NavbarProps {
    availableForWork?: boolean;
}

export default function Navbar({ availableForWork = true }: NavbarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleLinkClick = () => {
        setIsMobileOpen(false);
    };

    const handleCTA = () => {
        setIsMobileOpen(false);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <a href="#" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Aryan<span className="pink-dot">.dev</span>
                    {availableForWork && (
                        <span className="avail-badge-inline" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: 'var(--color-teal)',
                            color: 'var(--color-navy)',
                            border: '2px solid var(--color-navy)',
                            fontSize: '9px',
                            fontWeight: '900',
                            padding: '2px 6px',
                            boxShadow: '2px 2px 0 var(--color-navy)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.5px'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: 'var(--color-navy)',
                                borderRadius: '50%'
                            }}></span>
                            ACTIVE
                        </span>
                    )}
                </a>
                
                <div className="nav-links">
                    <a href="#projects" className="nav-link">PROJECTS</a>
                    <a href="#skills" className="nav-link">SKILLS</a>
                    <a href="#experience" className="nav-link">EXPERIENCE</a>
                    <a href="#certifications" className="nav-link">CERTIFICATIONS</a>
                    <a href="#contact" className="nav-link">CONTACT</a>
                </div>

                <button className="btn btn-teal nav-cta" onClick={handleCTA}>
                    HIRE ME
                </button>

                <button 
                    className={`mobile-menu-toggle ${isMobileOpen ? 'active' : ''}`} 
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation menu"
                    id="mobile-nav-toggle"
                >
                    <span className="bar" style={{ transform: isMobileOpen ? 'rotate(45deg) translate(6px, 6px)' : '' }}></span>
                    <span className="bar" style={{ opacity: isMobileOpen ? 0 : 1 }}></span>
                    <span className="bar" style={{ transform: isMobileOpen ? 'rotate(-45deg) translate(6px, -6px)' : '' }}></span>
                </button>
            </nav>

            {/* Mobile Nav Drawer */}
            <div className={`mobile-nav ${isMobileOpen ? 'active' : ''}`} id="mobile-nav-drawer">
                <a href="#projects" className="mobile-link" onClick={handleLinkClick}>PROJECTS</a>
                <a href="#skills" className="mobile-link" onClick={handleLinkClick}>SKILLS</a>
                <a href="#experience" className="mobile-link" onClick={handleLinkClick}>EXPERIENCE</a>
                <a href="#certifications" className="mobile-link" onClick={handleLinkClick}>CERTIFICATIONS</a>
                <a href="#contact" className="mobile-link" onClick={handleLinkClick}>CONTACT</a>
                <button className="btn btn-teal mobile-cta" onClick={handleCTA}>
                    HIRE ME
                </button>
            </div>
        </div>
    );
}
