"use client";

import { useEffect, useState } from 'react';

export default function ExperienceAdmin() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [experienceForm, setExperienceForm] = useState({
        role: '',
        company: '',
        period: '',
        description: '',
        type: 'Work'
    });
    const [editExperienceId, setEditExperienceId] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadExperience = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/experience');
            const resData = await res.json();
            if (resData.data) {
                setExperiences(resData.data);
            }
        } catch (err) {
            triggerToast('FAILED TO FETCH JOURNEY ENTRIES! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExperience();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editExperienceId ? `/api/experience/${editExperienceId}` : '/api/experience';
        const method = editExperienceId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienceForm)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            triggerToast(editExperienceId ? 'EXPERIENCE UPDATED! ⚡' : 'JOURNEY ENTRY CREATED! 🎉');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }

            setExperienceForm({ role: '', company: '', period: '', description: '', type: 'Work' });
            setEditExperienceId(null);
            loadExperience();
        } catch (err: any) {
            triggerToast(err.message || 'OPERATION FAILED! ❌');
        }
    };

    const handleEditClick = (exp: any) => {
        setEditExperienceId(exp.id);
        setExperienceForm({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            description: exp.description,
            type: exp.type
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        try {
            const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Deletion failed');
            triggerToast('ENTRY DELETED FROM TIMELINE! 🗑️');
            loadExperience();
        } catch (err) {
            triggerToast('DELETION FAILED! ❌');
        }
    };

    return (
        <>
            {loading ? (
                <div className="admin-empty-state">SYNCING TIMELINE RECORDS WITH DATABASE...</div>
            ) : (
                <div className="admin-grid-layout">
                    {/* List */}
                    <div className="admin-card">
                        <h3 className="admin-card-title">TIMELINE HISTORY ({experiences.length})</h3>
                        <div className="admin-list">
                            {experiences.length === 0 ? (
                                <div className="admin-empty-state">NO TIMELINE LOGS RECORDED.</div>
                            ) : (
                                experiences.map(e => (
                                    <div key={e.id} className="admin-list-item">
                                        <div className="admin-item-details">
                                            <h4>{e.role}</h4>
                                            <p style={{ fontWeight: '800' }}>{e.company} // {e.period}</p>
                                            <p>{e.description}</p>
                                            <span className="admin-item-badge" style={{ marginTop: '8px', display: 'inline-block' }}>{e.type}</span>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button 
                                                className="btn btn-white admin-item-btn"
                                                onClick={() => handleEditClick(e)}
                                            >
                                                EDIT
                                            </button>
                                            <button 
                                                className="btn btn-danger admin-item-btn"
                                                onClick={() => handleDelete(e.id)}
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
                            {editExperienceId ? 'EDIT TIMELINE ITEM' : 'ADD TIMELINE ITEM'}
                        </h3>
                        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '0', boxShadow: 'none', border: 'none' }}>
                            <div className="form-group">
                                <label className="form-label">ROLE / POSITION</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={experienceForm.role}
                                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">COMPANY / INSTITUTION</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={experienceForm.company}
                                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TIME PERIOD</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. 2024 - PRESENT"
                                    value={experienceForm.period}
                                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DESCRIPTION</label>
                                <textarea 
                                    className="form-textarea" 
                                    rows={3} 
                                    value={experienceForm.description}
                                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TYPE</label>
                                <select 
                                    className="form-select"
                                    value={experienceForm.type}
                                    onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value })}
                                >
                                    <option value="Work">WORK EXPERIENCE</option>
                                    <option value="Education">EDUCATION</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-orange form-submit-btn" style={{ flexGrow: 1 }}>
                                    {editExperienceId ? 'SAVE CHANGES' : 'CREATE ITEM'}
                                </button>
                                {editExperienceId && (
                                    <button 
                                        type="button" 
                                        className="btn btn-white" 
                                        onClick={() => {
                                            setEditExperienceId(null);
                                            setExperienceForm({ role: '', company: '', period: '', description: '', type: 'Work' });
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

            <div className={`toast ${showToast ? 'show' : ''}`} id="exp-toast">
                {toastMsg}
            </div>
        </>
    );
}
