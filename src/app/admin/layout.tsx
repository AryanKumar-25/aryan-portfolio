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
    const [unreadCount, setUnreadCount] = useState(0);

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

    // Poll unread message count every 30s so badge stays fresh
    const fetchUnread = async () => {
        try {
            const res = await fetch('/api/messages');
            if (!res.ok) return;
            const json = await res.json();
            const count = (json.data ?? []).filter((m: any) => !m.read).length;
            setUnreadCount(count);
        } catch { /* silent */ }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 30_000);
        return () => clearInterval(interval);
    }, []);

    // Re-fetch when navigating away from /messages (user may have read some)
    useEffect(() => {
        if (pathname !== '/admin/messages') fetchUnread();
    }, [pathname]);

    const navItems = [
        { name: 'PROJECTS',      path: '/admin/projects' },
        { name: 'EXPERIENCE',    path: '/admin/experience' },
        { name: 'MESSAGES',      path: '/admin/messages', badge: unreadCount },
        { name: 'SKILLS',        path: '/admin/skills' },
        { name: 'CERTIFICATIONS',path: '/admin/certifications' },
        { name: 'RESUME UPLOAD', path: '/admin/resume' },
        { name: 'SITE SETTINGS', path: '/admin/settings' },
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
                            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <span>{item.name}</span>
                            {item.badge != null && item.badge > 0 && (
                                <span style={{
                                    backgroundColor: pathname === item.path ? 'var(--color-white)' : 'var(--color-orange)',
                                    color: pathname === item.path ? 'var(--color-orange)' : 'var(--color-white)',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 900,
                                    fontSize: '10px',
                                    padding: '1px 6px',
                                    borderRadius: '2px',
                                    border: '1.5px solid currentColor',
                                    lineHeight: 1.5,
                                    flexShrink: 0,
                                }}>
                                    {item.badge}
                                </span>
                            )}
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
