"use client";

import { useState } from 'react';

interface ContactProps {
    email: string;
}

export default function Contact({ email }: ContactProps) {
    const [name, setName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const displayToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleCopyEmail = (e: React.MouseEvent) => {
        navigator.clipboard.writeText(email);
        displayToast('EMAIL ADDRESS COPIED TO CLIPBOARD! ⚡');
        if (window.triggerConfetti) {
            window.triggerConfetti(e.clientX, e.clientY);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !emailInput || !message) {
            displayToast('PLEASE FILL ALL CONTACT FIELDS! ❌');
            return;
        }

        displayToast('MESSAGE SENT SUCCESSFULLY! TALK SOON! 🚀');
        setName('');
        setEmailInput('');
        setMessage('');

        // Trigger confetti bursts across the screen
        if (window.triggerConfetti) {
            window.triggerConfetti(window.innerWidth / 3, window.innerHeight / 2);
            setTimeout(() => {
                window.triggerConfetti?.((window.innerWidth / 3) * 2, window.innerHeight / 2);
            }, 250);
        }
    };

    return (
        <section id="contact" className="section-contact container">
            <div className="contact-layout">
                {/* Contact Left socials block */}
                <div className="reveal active">
                    <h2 className="contact-title">LET'S BUILD TOGETHER.</h2>
                    <p className="contact-subtext">
                        Got a project in mind, want to discuss software architecture, or simply chat about brutalist design? 
                        Fire away. I'm always open to new contracts and collaborations.
                    </p>
                    
                    <div className="contact-buttons-list">
                        <button 
                            className="btn btn-white contact-link-btn" 
                            onClick={handleCopyEmail}
                            id="contact-email-copy-btn"
                        >
                            <span>{email.toUpperCase()}</span>
                            <span className="btn-icon-label">[ COPY ]</span>
                        </button>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-white contact-link-btn"
                            id="contact-linkedin-btn"
                        >
                            <span>LINKEDIN</span>
                            <span className="btn-icon-label">[ ↗ ]</span>
                        </a>
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-white contact-link-btn"
                            id="contact-github-btn"
                        >
                            <span>GITHUB</span>
                            <span className="btn-icon-label">[ ↗ ]</span>
                        </a>
                    </div>
                </div>

                {/* Contact Right Form card */}
                <div className="reveal active" style={{ transitionDelay: '0.2s' }}>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="contact-name">NAME / ORGANIZATION</label>
                            <input 
                                id="contact-name"
                                type="text" 
                                className="form-input" 
                                placeholder="e.g. Satoshi Nakamoto" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="contact-email">EMAIL ADDRESS</label>
                            <input 
                                id="contact-email"
                                type="email" 
                                className="form-input" 
                                placeholder="e.g. satoshi@bitcoin.org" 
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="contact-message">PROJECT DESCRIPTION</label>
                            <textarea 
                                id="contact-message"
                                className="form-textarea" 
                                rows={4} 
                                placeholder="Brief details about what you are building..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-navy form-submit-btn" id="contact-submit-btn">
                            SEND MESSAGE
                        </button>
                    </form>
                </div>
            </div>

            {/* Toast Alert Pop */}
            <div className={`toast ${showToast ? 'show' : ''}`} id="clipboard-toast">
                {toastMsg}
            </div>
        </section>
    );
}
