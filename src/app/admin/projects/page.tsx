"use client";

import { useEffect, useState } from 'react';

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        featured: false
    });
    const [editProjectId, setEditProjectId] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            const resData = await res.json();
            if (resData.data) {
                setProjects(resData.data);
            }
        } catch (err) {
            triggerToast('FAILED TO FETCH PROJECTS! ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editProjectId ? `/api/projects/${editProjectId}` : '/api/projects';
        const method = editProjectId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectForm)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            triggerToast(editProjectId ? 'PROJECT MODIFIED! ⚡' : 'NEW PROJECT ADDED! 🎉');
            if (window.triggerConfetti) {
                window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }

            setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', featured: false });
            setEditProjectId(null);
            loadProjects();
        } catch (err: any) {
            triggerToast(err.message || 'OPERATION FAILED! ❌');
        }
    };

    const handleEditClick = (project: any) => {
        setEditProjectId(project.id);
        setProjectForm({
            title: project.title,
            description: project.description,
            tech_stack: project.tech_stack,
            github_url: project.github_url || '',
            live_url: project.live_url || '',
            featured: !!project.featured
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Deletion failed');
            triggerToast('PROJECT DELETED! 🗑️');
            loadProjects();
        } catch (err) {
            triggerToast('DELETION FAILED! ❌');
        }
    };

    return (
        <>
            {loading ? (
                <div className="admin-empty-state">SYNCING PROJECTS WITH DATABASE...</div>
            ) : (
                <div className="admin-grid-layout">
                    {/* List */}
                    <div className="admin-card">
                        <h3 className="admin-card-title">PROJECTS LISTING ({projects.length})</h3>
                        <div className="admin-list">
                            {projects.length === 0 ? (
                                <div className="admin-empty-state">NO PROJECTS RECORDED YET.</div>
                            ) : (
                                projects.map(p => (
                                    <div key={p.id} className="admin-list-item">
                                        <div className="admin-item-details">
                                            <h4>{p.title}</h4>
                                            <p>{p.description.slice(0, 120)}...</p>
                                            <div style={{ marginTop: '8px' }}>
                                                <span className="admin-item-badge">Featured: {p.featured ? 'YES' : 'NO'}</span>
                                                <span className="admin-item-badge">{p.tech_stack}</span>
                                            </div>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button 
                                                className="btn btn-white admin-item-btn"
                                                onClick={() => handleEditClick(p)}
                                            >
                                                EDIT
                                            </button>
                                            <button 
                                                className="btn btn-danger admin-item-btn"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add / Edit Form */}
                    <div className="admin-card" style={{ height: 'fit-content' }}>
                        <h3 className="admin-card-title">
                            {editProjectId ? 'EDIT PROJECT' : 'ADD PROJECT'}
                        </h3>
                        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '0', boxShadow: 'none', border: 'none' }}>
                            <div className="form-group">
                                <label className="form-label">TITLE</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    value={projectForm.title}
                                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">DESCRIPTION</label>
                                <textarea 
                                    className="form-textarea" 
                                    rows={3} 
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">TECH STACK (COMMA SEPARATED)</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="React, TypeScript, Go"
                                    value={projectForm.tech_stack}
                                    onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">GITHUB URL</label>
                                <input 
                                    type="url" 
                                    className="form-input" 
                                    value={projectForm.github_url}
                                    onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">LIVE PREVIEW URL</label>
                                <input 
                                    type="url" 
                                    className="form-input" 
                                    value={projectForm.live_url}
                                    onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <input 
                                    id="proj-featured"
                                    type="checkbox" 
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    checked={projectForm.featured}
                                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                                />
                                <label htmlFor="proj-featured" className="form-label" style={{ marginBottom: '0', cursor: 'pointer' }}>FEATURED PROJECT</label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="submit" className="btn btn-orange form-submit-btn" style={{ flexGrow: 1 }}>
                                    {editProjectId ? 'SAVE CHANGES' : 'CREATE PROJECT'}
                                </button>
                                {editProjectId && (
                                    <button 
                                        type="button" 
                                        className="btn btn-white" 
                                        onClick={() => {
                                            setEditProjectId(null);
                                            setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', live_url: '', featured: false });
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

            <div className={`toast ${showToast ? 'show' : ''}`} id="proj-toast">
                {toastMsg}
            </div>
        </>
    );
}
