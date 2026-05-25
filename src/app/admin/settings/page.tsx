"use client";

import { useEffect, useRef, useState } from 'react';

export default function SettingsAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [settings, setSettings] = useState({
        email: '',
        tagline: '',
        available_for_work: 'false'
    });

    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');

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
                if (resData.data.avatar_url) {
                    setAvatarUrl(resData.data.avatar_url);
                    setAvatarPreview(resData.data.avatar_url);
                }
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

    // Handle file selection → show local preview before upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            triggerToast('PLEASE SELECT A VALID IMAGE FILE ❌');
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
    };

    // Upload to /api/upload-avatar
    const handleAvatarUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            triggerToast('SELECT AN IMAGE FILE FIRST ❌');
            return;
        }

        setUploadingAvatar(true);
        triggerToast('UPLOADING PROFILE PHOTO... ⏳');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setAvatarUrl(data.url);
            setAvatarPreview(data.url);
            triggerToast('PROFILE PHOTO UPDATED! 🖼️');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            triggerToast(err.message || 'AVATAR UPLOAD FAILED! ❌');
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr' }}>
            {loading ? (
                <div className="admin-empty-state">SYNCING PORTFOLIO GLOBAL SETTINGS...</div>
            ) : (
                <>
                    {/* ── Profile Photo Card ─────────────────────────────── */}
                    <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto 24px', width: '100%' }}>
                        <h3 className="admin-card-title">PROFILE PHOTO</h3>
                        <p style={{ marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
                            Upload your profile picture. It is displayed in the circular hero frame on the main page.
                        </p>

                        {/* Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                border: '4px solid var(--color-navy)',
                                boxShadow: '4px 4px 0 var(--color-navy)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: 'var(--color-teal)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile photo preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                ) : (
                                    <span style={{
                                        fontSize: '2.5rem',
                                        fontWeight: '900',
                                        color: 'var(--color-navy)',
                                        fontFamily: 'var(--font-mono)'
                                    }}>A</span>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '8px', opacity: 0.7 }}>
                                    {avatarUrl ? 'CURRENT PHOTO SET ✓' : 'NO PHOTO SET — SHOWS INITIAL "A"'}
                                </p>
                                {avatarUrl && (
                                    <p style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10px',
                                        wordBreak: 'break-all',
                                        opacity: 0.5,
                                        maxWidth: '320px'
                                    }}>
                                        {avatarUrl.split('?')[0].split('/').pop()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* File picker + upload button */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <label
                                htmlFor="avatar-file-input"
                                className="btn btn-white"
                                style={{ cursor: 'pointer', fontSize: '12px' }}
                            >
                                CHOOSE PHOTO
                            </label>
                            <input
                                id="avatar-file-input"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="btn btn-teal"
                                style={{ fontSize: '12px' }}
                                onClick={handleAvatarUpload}
                                disabled={uploadingAvatar}
                                id="avatar-upload-btn"
                            >
                                {uploadingAvatar ? 'UPLOADING...' : 'UPLOAD & SAVE'}
                            </button>
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.5, marginTop: '12px' }}>
                            Accepts JPG, PNG, WEBP. Stored in Supabase Storage → avatars bucket.
                        </p>
                    </div>

                    {/* ── Site Settings Form ─────────────────────────────── */}
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
                </>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="settings-toast">
                {toastMsg}
            </div>
        </div>
    );
}
