"use client";

import { useEffect, useRef, useState } from 'react';

interface TerminalLine {
    text: string;
    type: 'default' | 'highlight' | 'success' | 'error';
    html?: boolean;
}

export default function TerminalShell() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<TerminalLine[]>([
        { text: "Welcome to Aryan's Interactive Terminal shell. [v1.1.0]", type: "success" },
        { text: "Type 'help' for a list of available commands.", type: "default" }
    ]);

    const logEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom on updates
    useEffect(() => {
        if (isOpen) {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [history, isOpen]);

    // CLI Commands logic
    const handleCommand = (cmdText: string) => {
        const cleanCmd = cmdText.trim().toLowerCase();
        const newHistory = [...history, { text: `guest@aryan.dev:~$ ${cmdText}`, type: 'highlight' as const }];

        if (cleanCmd === '') {
            setHistory(newHistory);
            return;
        }

        switch (cleanCmd) {
            case 'help':
                setHistory([
                    ...newHistory,
                    { text: "Available commands:", type: "highlight" },
                    { text: "  about      Display brief biographical summary", type: "default" },
                    { text: "  skills     List primary technologies in the stack", type: "default" },
                    { text: "  projects   Show details of featured software products", type: "default" },
                    { text: "  contact    Get social references and communication links", type: "default" },
                    { text: "  confetti   Trigger canvas particle explosion", type: "default" },
                    { text: "  clear      Wipe the terminal screen buffer", type: "default" },
                    { text: "  secret     Execute secret subroutine", type: "default" }
                ]);
                break;

            case 'about':
                setHistory([
                    ...newHistory,
                    { text: "Aryan is a Full Stack Developer specializing in building high-impact web applications.", type: "default" },
                    { text: "Focused on robust system design, clean API layers, and playful maximalist frontend layout systems.", type: "default" }
                ]);
                break;

            case 'skills':
                setHistory([
                    ...newHistory,
                    { text: "Primary Technical Skills:", type: "highlight" },
                    { text: "  - Languages:  JavaScript, TypeScript, Go, SQL", type: "default" },
                    { text: "  - Frontend:   React.js, Next.js, HTML5, CSS3, TailwindCSS", type: "default" },
                    { text: "  - Backend:    Node.js, Express, Go, REST APIs, gRPC", type: "default" },
                    { text: "  - Database:   PostgreSQL, Redis, Supabase", type: "default" },
                    { text: "  - DevOps:     Docker, AWS, Git, CI/CD pipelines", type: "default" }
                ]);
                break;

            case 'projects':
                setHistory([
                    ...newHistory,
                    { text: "Featured Projects:", type: "highlight" },
                    { text: "  1. NEXUS.OS  - Collaborative remote dashboard (Next.js & WebSockets)", type: "default" },
                    { text: "  2. KRYPTON.DB - Distributed lightweight key-value store (Go & React)", type: "default" },
                    { text: "  3. AURA.AI   - Semantic vector workspace orchestrations (Node & PG)", type: "default" }
                ]);
                break;

            case 'contact':
                setHistory([
                    ...newHistory,
                    { text: "Get in touch:", type: "highlight" },
                    { text: "  Email:    aryan.tech.work@gmail.com", type: "default" },
                    { text: "  GitHub:   https://github.com/aryan", type: "default" },
                    { text: "  LinkedIn: https://linkedin.com/in/aryan", type: "default" }
                ]);
                break;

            case 'confetti':
                if (window.triggerConfetti) {
                    window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
                    setHistory([
                        ...newHistory,
                        { text: "💥 Confetti initialized! Boom!", type: "success" }
                    ]);
                } else {
                    setHistory([
                        ...newHistory,
                        { text: "Confetti engine not initialized.", type: "error" }
                    ]);
                }
                break;

            case 'clear':
                setHistory([]);
                break;

            case 'secret':
                setHistory([
                    ...newHistory,
                    { text: "Unlocking secret ASCII Subroutine...", type: "success" },
                    { text: `
 /\\_/\\
( o.o )
 > ^ <  MEOW!
`, type: "default", html: true }
                ]);
                break;

            default:
                setHistory([
                    ...newHistory,
                    { text: `Command not found: '${cmdText}'. Type 'help' for support.`, type: "error" }
                ]);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    return (
        <>
            {/* Terminal Trigger Button */}
            <button 
                className={`terminal-trigger ${isOpen ? 'hide' : ''}`}
                onClick={() => setIsOpen(true)}
                id="terminal-open-btn"
            >
                <span>&gt;_ SHELL</span>
            </button>

            {/* Terminal Window Overlay */}
            <div className={`terminal-drawer ${isOpen ? 'active' : ''}`} id="terminal-drawer">
                <div className="terminal-header">
                    <div className="terminal-dots">
                        <div className="terminal-dot-btn red"></div>
                        <div className="terminal-dot-btn yellow"></div>
                        <div className="terminal-dot-btn green"></div>
                    </div>
                    <div className="terminal-title">guest@aryan.dev: ~/portfolio_shell</div>
                    <button 
                        className="terminal-minimize" 
                        onClick={() => setIsOpen(false)}
                        id="terminal-close-btn"
                    >
                        [ - ]
                    </button>
                </div>
                
                <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
                    <div className="terminal-log">
                        {history.map((line, idx) => (
                            <div 
                                key={idx} 
                                className={`
                                    ${line.type === 'highlight' ? 'term-highlight' : ''}
                                    ${line.type === 'success' ? 'term-success' : ''}
                                    ${line.type === 'error' ? 'term-error' : ''}
                                `}
                                style={{ whiteSpace: line.html ? 'pre' : 'normal' }}
                            >
                                {line.text}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>

                    <form onSubmit={handleFormSubmit} className="terminal-input-line">
                        <span className="terminal-prompt">guest@aryan.dev:~$</span>
                        <input 
                            ref={inputRef}
                            type="text" 
                            className="terminal-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoComplete="off"
                            autoCapitalize="off"
                            id="terminal-text-input"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
