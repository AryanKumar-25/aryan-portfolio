"use client";

import { useEffect, useState } from 'react';

export default function SettingsAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [settings, setSettings] = useState({
        email: '',
        tagline: '',
        available_for_work: 'false'
    });

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/settings');
            const resData = await res.json();
            if (resData.data) {
                setSettings({
                    email: resData.data.email || 'aryan.tech.work@gmail.com',
                    tagline: resData.data.tagline || 'CREATIVE FULL STACK ENGINEER SPECIALIZING IN HIGH PERFORMANCE DISTRIBUTED SYSTEM DESIGN & MAXIMALIST BOLD FRONTIERS.',
                    available_for_work: resData.data.available_for_work || 'false'
                });
            }
        } catch (err) {
            triggerToast('FAILED TO LOAD SITE CONFIGURATIONS! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        triggerToast('SAVING SITE CONFIGURATIONS... ⏳');

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            triggerToast('SITE CONFIGURATIONS MODIFIED! ⚡');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }
            loadSettings();
        } catch (err: any) {
            triggerToast(err.message || 'SETTINGS SAVING FAILED! ❌');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr' }}>
            {loading ? (
                <div className="admin-empty-state">SYNCING PORTFOLIO GLOBAL SETTINGS...</div>
            ) : (
                <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <h3 className="admin-card-title">GLOBAL SITE SETTINGS</h3>
                    <p style={{ marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
                        Manage primary text blocks, availability badges, and mail addresses dynamically.
                    </p>

                    <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '0', boxShadow: 'none', border: 'none' }}>
                        <div className="form-group">
                            <label className="form-label">CONTACT EMAIL ADDRESS</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">HERO TAGLINE / BIOGRAPHY</label>
                            <textarea 
                                className="form-textarea" 
                                rows={4} 
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                required 
                            />
                        </div>

                        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                            <input 
                                id="settings-avail"
                                type="checkbox" 
                                style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                                checked={settings.available_for_work === 'true'}
                                onChange={(e) => setSettings({ ...settings, available_for_work: e.target.checked ? 'true' : 'false' })}
                            />
                            <label htmlFor="settings-avail" className="form-label" style={{ marginBottom: '0', cursor: 'pointer' }}>
                                AVAILABLE FOR CONTRACT WORK (SHOWS BADGE ON SITE NAVBAR)
                            </label>
                        </div>

                        <button type="submit" className="btn btn-orange form-submit-btn" style={{ marginTop: '20px' }} disabled={saving}>
                            SAVE CONFIGURATION
                        </button>
                    </form>
                </div>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="settings-toast">
                {toastMsg}
            </div>
        </div>
    );
}
