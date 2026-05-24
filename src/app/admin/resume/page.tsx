"use client";

import { useEffect, useState } from 'react';

export default function ResumeAdmin() {
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadResume = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/resume');
            const resData = await res.json();
            if (resData.data) {
                setResume(resData.data);
            }
        } catch (err) {
            triggerToast('FAILED TO FETCH RESUME DATA! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResume();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure it's a PDF
        if (file.type !== 'application/pdf') {
            triggerToast('ONLY PDF FORMAT SUPPORTED! ❌');
            return;
        }

        setUploading(true);
        triggerToast('UPLOADING NEW PDF RESUME... ⏳');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'resume');

        try {
            // 1. Upload to storage bucket
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) throw new Error(uploadData.error);

            // 2. Save public URL to resume table
            const saveRes = await fetch('/api/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_url: uploadData.url })
            });
            const saveData = await saveRes.json();

            if (!saveRes.ok) throw new Error(saveData.error);

            triggerToast('RESUME FILE OVERWRITTEN SUCCESSFULLY! ⚡');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }

            loadResume();
        } catch (err: any) {
            triggerToast(err.message || 'UPLOAD PIPELINE FAILED! ❌');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="admin-grid-layout" style={{ gridTemplateColumns: '1fr' }}>
            {loading ? (
                <div className="admin-empty-state">RETRIEVING LATEST RESUME METADATA...</div>
            ) : (
                <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <h3 className="admin-card-title">RESUME DOCUMENT MANAGER</h3>
                    <p style={{ marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
                        Manage the active professional CV downloadable link across the website.
                    </p>

                    {resume ? (
                        <div style={{ border: '3px solid var(--color-navy)', padding: '20px', backgroundColor: '#fff', marginBottom: '25px', boxShadow: '4px 4px 0 var(--color-navy)' }}>
                            <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: '900' }}>Active Document</h4>
                            <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                                <strong>URL:</strong> <a href={resume.file_url} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', color: 'var(--color-pink)' }}>{resume.file_url}</a>
                            </p>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                                <strong>Uploaded At:</strong> {new Date(resume.uploaded_at).toLocaleString()}
                            </p>
                            
                            <a 
                                href={resume.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-teal"
                                style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
                            >
                                VIEW CURRENT RESUME
                            </a>
                        </div>
                    ) : (
                        <div style={{ border: '3px dashed var(--color-navy)', padding: '30px', textAlign: 'center', backgroundColor: '#fff', marginBottom: '25px' }}>
                            <p style={{ margin: '0', fontWeight: '800' }}>NO RESUME PDF DETECTED IN SUPABASE YET.</p>
                        </div>
                    )}

                    <div style={{ border: '3px solid var(--color-navy)', padding: '20px', backgroundColor: 'var(--color-offwhite)' }}>
                        <h4 style={{ margin: '0 0 15px 0', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: '900' }}>Upload / Replace PDF</h4>
                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: '8px' }}>CHOOSE PDF RESUME FILE</label>
                            <input 
                                type="file" 
                                className="form-input" 
                                accept="application/pdf" 
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </div>
                        {uploading && <p style={{ margin: '10px 0 0 0', color: 'var(--color-orange)', fontWeight: '800' }}>UPLOADING TO STORAGE... DO NOT CLOSE THIS DRAWER.</p>}
                    </div>
                </div>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="resume-toast">
                {toastMsg}
            </div>
        </div>
    );
}
