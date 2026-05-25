"use client";

import { useEffect, useRef, useState } from 'react';

interface TerminalLine {
    text: string;
    type: 'default' | 'highlight' | 'success' | 'error';
    html?: boolean;
}

// ── Supabase fetch helpers (hit the existing API routes) ────────────────────

async function fetchSkills(): Promise<string> {
    try {
        const res = await fetch('/api/skills');
        const json = await res.json();
        if (!json.data?.length) return 'No skills found.';
        return json.data.map((s: any) => s.name).join(', ');
    } catch {
        return 'Error fetching skills.';
    }
}

async function fetchProjects(): Promise<{ title: string; description: string; featured: boolean }[]> {
    try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

async function fetchExperience(): Promise<{ role: string; company: string; period: string }[]> {
    try {
        const res = await fetch('/api/experience');
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

async function fetchConfig(): Promise<Record<string, string>> {
    try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        return json.data || {};
    } catch {
        return {};
    }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TerminalShell() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [history, setHistory] = useState<TerminalLine[]>([
        { text: "Welcome to Aryan's Interactive Terminal shell. [v2.0.0]", type: 'success' },
        { text: "Type 'help' for available commands.", type: 'default' },
    ]);

    const logEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [history, isOpen]);

    const push = (base: TerminalLine[], lines: TerminalLine[]) => {
        setHistory([...base, ...lines]);
    };

    const handleCommand = async (cmdText: string) => {
        const clean = cmdText.trim().toLowerCase();
        const base: TerminalLine[] = [
            ...history,
            { text: `guest@aryan.dev:~$ ${cmdText}`, type: 'highlight' },
        ];

        if (clean === '') { setHistory(base); return; }

        // Save to command history for arrow-key navigation
        setCmdHistory(prev => [cmdText, ...prev].slice(0, 50));
        setHistoryIndex(-1);

        switch (clean) {

            // ── whoami ────────────────────────────────────────────────────
            case 'whoami': {
                const config = await fetchConfig();
                push(base, [
                    { text: 'Aryan — Creative Web Engineer', type: 'success' },
                    { text: config.tagline || 'Building bold, high-performance web systems.', type: 'default' },
                ]);
                break;
            }

            // ── skills / skills --list ────────────────────────────────────
            case 'skills':
            case 'skills --list': {
                push(base, [{ text: 'Fetching skills from database...', type: 'default' }]);
                const result = await fetchSkills();
                setHistory(prev => [
                    ...prev.slice(0, -1),
                    { text: '  ' + result, type: 'default' },
                ]);
                break;
            }

            // ── projects / projects --featured ────────────────────────────
            case 'projects':
            case 'projects --featured': {
                push(base, [{ text: 'Fetching projects from database...', type: 'default' }]);
                const projects = await fetchProjects();
                const featured = projects.filter(p => p.featured);
                const list = (featured.length ? featured : projects).slice(0, 5);
                if (!list.length) {
                    setHistory(prev => [...prev.slice(0, -1), { text: 'No projects found.', type: 'error' }]);
                } else {
                    setHistory(prev => [
                        ...prev.slice(0, -1),
                        { text: 'Featured Projects:', type: 'highlight' },
                        ...list.map((p, i) => ({
                            text: `  ${i + 1}. ${p.title}  —  ${p.description.slice(0, 60)}${p.description.length > 60 ? '...' : ''}`,
                            type: 'default' as const,
                        })),
                    ]);
                }
                break;
            }

            // ── experience / experience --current ─────────────────────────
            case 'experience':
            case 'experience --current': {
                push(base, [{ text: 'Fetching experience from database...', type: 'default' }]);
                const exp = await fetchExperience();
                if (!exp.length) {
                    setHistory(prev => [...prev.slice(0, -1), { text: 'No experience found.', type: 'error' }]);
                } else {
                    setHistory(prev => [
                        ...prev.slice(0, -1),
                        { text: 'Work Experience:', type: 'highlight' },
                        ...exp.slice(0, 4).map(e => ({
                            text: `  ${e.role}  @  ${e.company}  [${e.period}]`,
                            type: 'default' as const,
                        })),
                    ]);
                }
                break;
            }

            // ── status ────────────────────────────────────────────────────
            case 'status': {
                push(base, [{ text: 'Fetching site config...', type: 'default' }]);
                const config = await fetchConfig();
                const avail = config.available_for_work === 'true';
                setHistory(prev => [
                    ...prev.slice(0, -1),
                    { text: avail ? 'Available for work ✓' : 'Not currently available for work ✗', type: avail ? 'success' : 'error' },
                    { text: `  Email: ${config.email || 'aryan.tech.work@gmail.com'}`, type: 'default' },
                ]);
                break;
            }

            // ── help ──────────────────────────────────────────────────────
            case 'help':
                push(base, [
                    { text: 'Available commands:', type: 'highlight' },
                    { text: '  whoami               About me (live from Supabase)', type: 'default' },
                    { text: '  skills --list        All skills from the database', type: 'default' },
                    { text: '  projects --featured  Featured project titles + descriptions', type: 'default' },
                    { text: '  experience --current Work history from the database', type: 'default' },
                    { text: '  status               Availability + contact info', type: 'default' },
                    { text: '  about                Short bio', type: 'default' },
                    { text: '  contact              Social links', type: 'default' },
                    { text: '  confetti             🎉 Trigger particle explosion', type: 'default' },
                    { text: '  clear                Wipe the terminal screen', type: 'default' },
                    { text: '  secret               Execute secret subroutine', type: 'default' },
                ]);
                break;

            // ── about ─────────────────────────────────────────────────────
            case 'about':
                push(base, [
                    { text: 'Aryan — Creative Web Engineer', type: 'success' },
                    { text: 'Building robust, maximum-impact interfaces with solid backend system logic.', type: 'default' },
                    { text: 'Obsessed with extreme borders, drop-offset shadows, and pixel-perfect engineering.', type: 'default' },
                ]);
                break;

            // ── contact ───────────────────────────────────────────────────
            case 'contact': {
                const config = await fetchConfig();
                push(base, [
                    { text: 'Get in touch:', type: 'highlight' },
                    { text: `  Email:    ${config.email || 'aryan.tech.work@gmail.com'}`, type: 'default' },
                    { text: '  GitHub:   https://github.com/AryanKumar-25', type: 'default' },
                    { text: '  LinkedIn: https://linkedin.com/in/aryan', type: 'default' },
                ]);
                break;
            }

            // ── confetti ──────────────────────────────────────────────────
            case 'confetti':
                if (window.triggerConfetti) {
                    window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
                    push(base, [{ text: '💥 Confetti initialized! Boom!', type: 'success' }]);
                } else {
                    push(base, [{ text: 'Confetti engine not initialized.', type: 'error' }]);
                }
                break;

            // ── clear ─────────────────────────────────────────────────────
            case 'clear':
                setHistory([]);
                break;

            // ── secret ────────────────────────────────────────────────────
            case 'secret':
                push(base, [
                    { text: 'Unlocking secret ASCII subroutine...', type: 'success' },
                    { text: ` /\\_/\\\n( o.o )\n > ^ <  MEOW!`, type: 'default', html: true },
                ]);
                break;

            default:
                push(base, [
                    { text: `Command not found: '${cmdText}'. Type 'help' for support.`, type: 'error' },
                ]);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
            setHistoryIndex(next);
            setInput(cmdHistory[next] ?? '');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = historyIndex - 1;
            if (next < 0) { setHistoryIndex(-1); setInput(''); }
            else { setHistoryIndex(next); setInput(cmdHistory[next] ?? ''); }
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                className={`terminal-trigger ${isOpen ? 'hide' : ''}`}
                onClick={() => setIsOpen(true)}
                id="terminal-open-btn"
            >
                <span>&gt;_ SHELL</span>
            </button>

            {/* Terminal Window */}
            <div className={`terminal-drawer ${isOpen ? 'active' : ''}`} id="terminal-drawer">
                <div className="terminal-header">
                    <div className="terminal-dots">
                        <div className="terminal-dot-btn red" />
                        <div className="terminal-dot-btn yellow" />
                        <div className="terminal-dot-btn green" />
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
                                className={
                                    line.type === 'highlight' ? 'term-highlight' :
                                    line.type === 'success'   ? 'term-success'   :
                                    line.type === 'error'     ? 'term-error'     : ''
                                }
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
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
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
