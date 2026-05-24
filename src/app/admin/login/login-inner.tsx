"use client";

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomCursor from '@/components/CustomCursor';
import ConfettiCanvas from '@/components/ConfettiCanvas';

export default function AdminLoginInner() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shouldShake, setShouldShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const triggerShake = () => {
        setShouldShake(true);
        setTimeout(() => {
            setShouldShake(false);
            inputRef.current?.focus();
        }, 600);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || success) return;

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Access Denied');
                setPassword('');
                triggerShake();
            } else {
                setSuccess(true);
                setError('');
                if (window.triggerConfetti) {
                    window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
                }
                const destination = searchParams.get('from') || '/admin/projects';
                setTimeout(() => {
                    router.push(destination);
                    router.refresh();
                }, 900);
            }
        } catch {
            setError('Connection error. Please retry.');
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-dots" aria-hidden="true" />

            <div className={`login-card ${shouldShake ? 'shake' : ''}`}>

                {/* Logo */}
                <div className="login-logo-wrap">
                    <span className="login-logo">ARYAN<span className="pink-dot">.dev</span></span>
                    <div className="login-badge">ADMIN ZONE</div>
                </div>

                <p className="login-subtitle">[ SYSTEM ADMINISTRATOR ACCESS ]</p>

                {/* Error state */}
                {error && (
                    <div className="login-error" role="alert">
                        ⛔ &nbsp;{error.toUpperCase()}
                    </div>
                )}

                {/* Success state */}
                {success && (
                    <div className="login-success-msg" role="status">
                        ✅ &nbsp;ACCESS GRANTED — ENTERING DASHBOARD...
                    </div>
                )}

                {/* Login form */}
                {!success && (
                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        <div className="form-group" style={{ width: '100%' }}>
                            <label className="form-label" htmlFor="admin-pwd">
                                SECRET PASSWORD
                            </label>
                            <input
                                ref={inputRef}
                                id="admin-pwd"
                                type="password"
                                className="form-input"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                autoFocus
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-orange form-submit-btn"
                            disabled={loading || !password}
                            id="login-submit-btn"
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD →'}
                        </button>
                    </form>
                )}

                <p className="login-note">
                    Private area — unauthorized access is prohibited.
                </p>
            </div>

            <CustomCursor />
            <ConfettiCanvas />
        </div>
    );
}
