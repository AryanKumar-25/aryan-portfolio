"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import CustomCursor from '@/components/CustomCursor';
import ConfettiCanvas from '@/components/ConfettiCanvas';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Skip wrapping for the login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            triggerToast('LOGGING OUT... GOODBYE! 👋');
            setTimeout(() => {
                router.push('/admin/login');
                router.refresh();
            }, 800);
        } catch (err) {
            triggerToast('LOGOUT FAILED! ❌');
        }
    };

    const navItems = [
        { name: 'PROJECTS', path: '/admin/projects' },
        { name: 'EXPERIENCE', path: '/admin/experience' },
        { name: 'SKILLS', path: '/admin/skills' },
        { name: 'CERTIFICATIONS', path: '/admin/certifications' },
        { name: 'RESUME UPLOAD', path: '/admin/resume' },
        { name: 'SITE SETTINGS', path: '/admin/settings' }
    ];

    const currentTabName = navItems.find(item => item.path === pathname)?.name || 'DASHBOARD';

    return (
        <div className="admin-container">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    ARYAN<span className="pink-dot">.dev</span>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <button 
                            key={item.path}
                            className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
                            onClick={() => router.push(item.path)}
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-title">
                        ADMIN PANEL // {currentTabName}
                    </div>
                    <div className="admin-topbar-actions">
                        <a href="/" className="btn btn-white admin-topbar-btn" target="_blank" rel="noopener noreferrer">
                            VIEW SITE
                        </a>
                        <button className="btn btn-pink admin-topbar-btn" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>

            {/* Toast popup */}
            <div className={`toast ${showToast ? 'show' : ''}`} id="admin-toast">
                {toastMsg}
            </div>

            {/* Custom Utilities */}
            <CustomCursor />
            <ConfettiCanvas />
        </div>
    );
}
