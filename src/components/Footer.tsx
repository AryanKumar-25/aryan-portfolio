"use client";

interface FooterProps {
    availableForWork?: boolean;
}

export default function Footer({ availableForWork = true }: FooterProps) {
    const handleConfetti = (e: React.MouseEvent) => {
        if (window.triggerConfetti) {
            window.triggerConfetti(e.clientX, e.clientY);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <a href="#" className="footer-logo">
                    Aryan<span className="pink-dot">.dev</span>
                </a>
                
                {/* Available for work pulsing status */}
                <div 
                    className="status-badge" 
                    onClick={handleConfetti}
                    role="button"
                    aria-label={`Availability Status: ${availableForWork ? 'Active' : 'Inactive'}`}
                    id="footer-status-badge"
                >
                    <span 
                        className="status-dot" 
                        style={{ 
                            backgroundColor: availableForWork ? '#10b981' : '#ef4444',
                            boxShadow: availableForWork ? '0 0 8px #10b981' : 'none'
                        }}
                    ></span>
                    <span>{availableForWork ? 'AVAILABLE FOR WORK' : 'NOT AVAILABLE FOR HIRE'}</span>
                </div>

                <div className="footer-copy">
                    &copy; {new Date().getFullYear()} ARYAN. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    );
}
