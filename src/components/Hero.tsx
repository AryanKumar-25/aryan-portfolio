"use client";

interface HeroProps {
    tagline: string;
    resumeUrl: string;
}

export default function Hero({ tagline, resumeUrl }: HeroProps) {
    const handleConfetti = (e: React.MouseEvent) => {
        if (window.triggerConfetti) {
            window.triggerConfetti(e.clientX, e.clientY);
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="section-hero">
            <div className="hero-container">
                {/* Hero Left Content */}
                <div className="hero-left reveal active">
                    <div className="section-tag">GUEST_USER@ARYAN.DEV:~$ WHOAMI</div>
                    <h1 className="hero-heading">
                        <span className="hero-line hero-line-stroke">CREATIVE</span>
                        <span className="hero-line hero-line-solid">FULL STACK</span>
                        <span className="hero-line hero-line-orange">DEVELOPER_</span>
                    </h1>
                    <p className="hero-subtext">
                        {tagline}
                    </p>
                    <div className="hero-actions">
                        <button 
                            className="btn btn-pink" 
                            onClick={(e) => { handleConfetti(e); scrollToSection('projects'); }}
                            id="hero-view-work-btn"
                        >
                            VIEW WORK
                        </button>
                        <a 
                            href={resumeUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-white" 
                            onClick={handleConfetti}
                            id="hero-resume-btn"
                        >
                            GET RESUME
                        </a>
                    </div>
                </div>

                {/* Hero Right Avatar Graphic */}
                <div className="avatar-canvas-wrapper reveal active" style={{ transitionDelay: '0.2s' }}>
                    {/* Floating elements */}
                    <div className="floating-element float-smiley">⚡</div>
                    <div className="floating-element float-code">
                        <code>const dev = true;</code>
                    </div>

                    <div className="avatar-circle">
                        <span className="avatar-initial">A</span>
                    </div>

                    {/* Interactive Stat Badge */}
                    <div 
                        className="stat-badge" 
                        onClick={handleConfetti}
                        role="button"
                        aria-label="Click for confetti"
                        id="hero-stat-badge"
                    >
                        <span className="stat-num">15+</span>
                        <span className="stat-label">PROJECTS</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
