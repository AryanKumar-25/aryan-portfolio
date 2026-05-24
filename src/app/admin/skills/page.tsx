"use client";

import { useEffect, useState } from 'react';

export default function SkillsAdmin() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [skillForm, setSkillForm] = useState({
        name: '',
        category: 'Frontend'
    });

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadSkills = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/skills');
            const resData = await res.json();
            if (resData.data) {
                setSkills(resData.data);
            }
        } catch (err) {
            triggerToast('FAILED TO FETCH SKILLS TAGS! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(skillForm)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            triggerToast('SKILL KEY REGISTERED! 🚀');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }

            setSkillForm({ name: '', category: 'Frontend' });
            loadSkills();
        } catch (err: any) {
            triggerToast(err.message || 'SKILL REGISTRATION FAILED! ❌');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill tag?')) return;
        try {
            const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Deletion failed');
            triggerToast('SKILL TAG SCRUBBED! 🗑️');
            loadSkills();
        } catch (err) {
            triggerToast('DELETION FAILED! ❌');
        }
    };

    return (
        <>
            {loading ? (
                <div className="admin-empty-state">SYNCING PORTFOLIO SKILLS WITH DATABASE...</div>
            ) : (
                <div className="admin-grid-layout">
                    {/* List */}
                    <div className="admin-card">
                        <h3 className="admin-card-title">ACTIVE SKILLS GRID ({skills.length})</h3>
                        <div className="skills-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            {skills.length === 0 ? (
                                <div className="admin-empty-state" style={{ gridColumn: 'span 3' }}>NO SKILLS RECORDED.</div>
                            ) : (
                                skills.map(s => (
                                    <div key={s.id} className="skill-card" style={{ padding: '20px 10px', position: 'relative' }}>
                                        <h3 className="skill-name" style={{ marginBottom: '4px' }}>{s.name}</h3>
                                        <div style={{ fontSize: '11px', color: 'var(--color-gray)', fontFamily: 'var(--font-mono)', marginBottom: '14px' }}>
                                            {s.category.toUpperCase()}
                                        </div>
                                        <button 
                                            className="btn btn-danger" 
                                            style={{ fontSize: '10px', padding: '4px 10px', boxShadow: '2px 2px 0 var(--color-navy)' }}
                                            onClick={() => handleDelete(s.id)}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="admin-card" style={{ height: 'fit-content' }}>
                        <h3 className="admin-card-title">ADD SKILL</h3>
                        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '0', boxShadow: 'none', border: 'none' }}>
                            <div className="form-group">
                                <label className="form-label">SKILL NAME</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="e.g. Next.js"
                                    value={skillForm.name}
                                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">CATEGORY</label>
                                <select 
                                    className="form-select"
                                    value={skillForm.category}
                                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                                >
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Database">Database</option>
                                    <option value="Tools">Tools</option>
                                    <option value="Cloud">Cloud</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-orange form-submit-btn" style={{ marginTop: '10px' }}>
                                ADD SKILL KEY
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="skills-toast">
                {toastMsg}
            </div>
        </>
    );
}
