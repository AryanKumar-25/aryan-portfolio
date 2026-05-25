"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TIMEOUT_MS   = 10 * 60 * 1000; // 10 minutes
const WARNING_MS   = 60 * 1000;       // warn 1 minute before logout
const TICK_INTERVAL = 1_000;          // countdown ticks every second

const ACTIVITY_EVENTS = [
    'mousemove', 'mousedown', 'keypress',
    'scroll', 'touchstart', 'click',
] as const;

export default function SessionGuard() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);

    // Refs so callbacks never go stale
    const logoutTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearAll = () => {
        if (logoutTimer.current)  clearTimeout(logoutTimer.current);
        if (warningTimer.current) clearTimeout(warningTimer.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
    };

    const doLogout = useCallback(async () => {
        clearAll();
        setShowWarning(false);
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { /* silent */ }
        router.push('/admin/login');
    }, [router]);

    const startCountdown = useCallback(() => {
        setSecondsLeft(60);
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    return 0;
                }
                return s - 1;
            });
        }, TICK_INTERVAL);
    }, []);

    const resetTimer = useCallback(() => {
        clearAll();
        setShowWarning(false);

        // Schedule warning
        warningTimer.current = setTimeout(() => {
            setShowWarning(true);
            startCountdown();
            // Schedule actual logout after the warning window
            logoutTimer.current = setTimeout(doLogout, WARNING_MS);
        }, TIMEOUT_MS - WARNING_MS);
    }, [doLogout, startCountdown]);

    // Bind activity listeners
    useEffect(() => {
        resetTimer(); // start on mount

        const handleActivity = () => {
            // Only reset if warning is NOT showing — once warning is visible,
            // only the "Stay Logged In" button should reset the timer
            if (!showWarning) resetTimer();
        };

        ACTIVITY_EVENTS.forEach(ev =>
            window.addEventListener(ev, handleActivity, { passive: true })
        );

        return () => {
            clearAll();
            ACTIVITY_EVENTS.forEach(ev =>
                window.removeEventListener(ev, handleActivity)
            );
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // mount once — resetTimer is stable via useCallback

    if (!showWarning) return null;

    return (
        <>
            {/* Backdrop */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15,23,42,0.6)',
                zIndex: 99998,
                backdropFilter: 'blur(2px)',
            }} />

            {/* Warning dialog */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 99999,
                backgroundColor: 'var(--color-white)',
                border: '4px solid var(--color-orange)',
                boxShadow: '8px 8px 0 var(--color-navy)',
                padding: '40px 48px',
                width: '100%',
                maxWidth: '440px',
                textAlign: 'center',
            }}>
                {/* Icon */}
                <div style={{
                    fontSize: '36px',
                    marginBottom: '16px',
                    lineHeight: 1,
                }}>
                    ⚠️
                </div>

                {/* Heading */}
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '22px',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    color: 'var(--color-navy)',
                    marginBottom: '12px',
                }}>
                    SESSION EXPIRING
                </h2>

                {/* Body */}
                <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--color-navy)',
                    marginBottom: '24px',
                    lineHeight: 1.6,
                }}>
                    You will be logged out in{' '}
                    <span style={{ color: 'var(--color-orange)', fontWeight: 900 }}>
                        {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}
                    </span>
                    {' '}due to inactivity.
                </p>

                {/* Countdown bar */}
                <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e2e8f0',
                    border: '2px solid var(--color-navy)',
                    marginBottom: '28px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${(secondsLeft / 60) * 100}%`,
                        backgroundColor: secondsLeft > 20
                            ? 'var(--color-orange)'
                            : 'var(--color-pink)',
                        transition: 'width 1s linear, background-color 0.3s ease',
                    }} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button
                        onClick={resetTimer}
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            backgroundColor: '#2EC4B6',
                            color: 'var(--color-navy)',
                            border: '3px solid var(--color-navy)',
                            boxShadow: '4px 4px 0 var(--color-navy)',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 var(--color-navy)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = '';
                            (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 var(--color-navy)';
                        }}
                    >
                        STAY LOGGED IN
                    </button>

                    <button
                        onClick={doLogout}
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            backgroundColor: '#FF3366',
                            color: 'var(--color-white)',
                            border: '3px solid var(--color-navy)',
                            boxShadow: '4px 4px 0 var(--color-navy)',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 var(--color-navy)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = '';
                            (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 var(--color-navy)';
                        }}
                    >
                        LOGOUT NOW
                    </button>
                </div>
            </div>
        </>
    );
}
