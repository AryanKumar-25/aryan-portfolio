"use client";

import { useEffect, useState } from 'react';

export default function CertificationsAdmin() {
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [certForm, setCertForm] = useState({
        name: '',
        issuer: '',
        date: '',
        url: '',
        badge_image_url: ''
    });
    const [editCertId, setEditCertId] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadCertifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/certifications');
            const resData = await res.json();
            if (resData.data) {
                setCertifications(resData.data);
            }
        } catch (err) {
            triggerToast('FAILED TO FETCH CREDENTIALS! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCertifications();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        triggerToast('UPLOADING BADGE IMAGE... ⏳');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'certificates');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setCertForm(prev => ({ ...prev, badge_image_url: data.url }));
            triggerToast('BADGE UPLOADED SUCCESSFULLY! ⚡');
        } catch (err: any) {
            triggerToast(err.message || 'UPLOAD FAILED! ❌');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editCertId ? `/api/certifications/${editCertId}` : '/api/certifications';
        const method = editCertId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(certForm)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            triggerToast(editCertId ? 'CREDENTIAL EDITED! ⚡' : 'CREDENTIAL LOGGED! 🎉');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }

            setCertForm({ name: '', issuer: '', date: '', url: '', badge_image_url: '' });
            setEditCertId(null);
            loadCertifications();
        } catch (err: any) {
            triggerToast(err.message || 'OPERATION FAILED! ❌');
        }
    };

    const handleEditClick = (cert: any) => {
        setEditCertId(cert.id);
        setCertForm({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            url: cert.url || '',
            badge_image_url: cert.badge_image_url || ''
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this credential?')) return;
        try {
            const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Deletion failed');
            triggerToast('CREDENTIAL DELETED! 🗑️');
            loadCertifications();
        } catch (err) {
            triggerToast('DELETION FAILED! ❌');
        }
    };

    return (
        <>
            {loading ? (
                <div className="admin-empty-state">SYNCING PORTFOLIO CERTIFICATIONS...</div>
            ) : (
                <div className="admin-grid-layout">
                    {/* List */}
                    <div className="admin-card">
                        <h3 className="admin-card-title">CREDENTIALS RECORD ({certifications.length})</h3>
                        <div className="admin-list">
                            {certifications.length === 0 ? (
                                <div className="admin-empty-state">NO CERTIFICATIONS LOGGED.</div>
                            ) : (
                                certifications.map(c => (
                                    <div key={c.id} className="admin-list-item">
                                        <div className="admin-item-details">
                                            <h4>{c.name}</h4>
                                            <p style={{ fontWeight: '800' }}>Issuer: {c.issuer} // {c.date}</p>
                                            {c.url && <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Link: {c.url}</p>}
                                            {c.badge_image_url && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <img 
                                                        src={c.badge_image_url} 
                                                        alt="Badge Preview" 
                                                        style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid var(--color-navy)' }} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="admin-item-actions">
                                            <button 
                                                className="btn btn-white admin-item-btn"
                                                onClick={() => handleEditClick(c)}
                                            >
                                                EDIT
                                            </button>
                                            <button 
                                                className="btn btn-danger admin-item-btn"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="admin-card" style={{ height: 'fit-content' }}>
                        <h3 className="admin-card-title">
                            {editCertId ? 'EDIT CREDENTIAL' : 'ADD CREDENTIAL'}
                        </h3>
                        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '0', boxShadow: 'none', border: 'none' }}>
                            <div className="form-group">
                                <label className="form-label">CERTIFICATE NAME</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={certForm.name}
                                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">ISSUING ORGANIZATION</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={certForm.issuer}
                                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DATE ISSUED</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. March 2026"
                                    value={certForm.date}
                                    onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">VERIFICATION LINK (URL)</label>
                                <input 
                                    type="url" 
                                    className="form-input" 
                                    value={certForm.url}
                                    onChange={(e) => setCertForm({ ...certForm, url: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">BADGE IMAGE</label>
                                <input 
                                    type="file" 
                                    className="form-input" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                {certForm.badge_image_url && (
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '11px', color: 'green', wordBreak: 'break-all' }}>Image Loaded: {certForm.badge_image_url}</p>
                                        <img src={certForm.badge_image_url} alt="Uploaded badge preview" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '2px solid var(--color-navy)', marginTop: '4px' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-orange form-submit-btn" style={{ flexGrow: 1 }} disabled={uploading}>
                                    {editCertId ? 'SAVE CHANGES' : 'LOG CREDENTIAL'}
                                </button>
                                {editCertId && (
                                    <button 
                                        type="button" 
                                        className="btn btn-white" 
                                        onClick={() => {
                                            setEditCertId(null);
                                            setCertForm({ name: '', issuer: '', date: '', url: '', badge_image_url: '' });
                                        }}
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="cert-toast">
                {toastMsg}
            </div>
        </>
    );
}
