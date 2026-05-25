"use client";

import { useEffect, useState } from 'react';

interface Message {
    id: string;
    created_at: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
}

export default function MessagesAdmin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg: string) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const loadMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/messages');
            const data = await res.json();
            if (data.data) setMessages(data.data);
        } catch {
            triggerToast('FAILED TO LOAD MESSAGES ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMessages(); }, []);

    const handleExpand = async (msg: Message) => {
        // Toggle closed if already open
        if (expanded === msg.id) {
            setExpanded(null);
            return;
        }
        setExpanded(msg.id);

        // Mark as read if unread
        if (!msg.read) {
            try {
                await fetch(`/api/messages/${msg.id}`, { method: 'PATCH' });
                setMessages(prev =>
                    prev.map(m => m.id === msg.id ? { ...m, read: true } : m)
                );
            } catch { /* silent */ }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setMessages(prev => prev.filter(m => m.id !== id));
            if (expanded === id) setExpanded(null);
            triggerToast('MESSAGE DELETED 🗑️');
        } catch {
            triggerToast('DELETE FAILED ❌');
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div style={{ maxWidth: '780px' }}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '28px',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                }}>
                    INBOX
                </h2>
                {unreadCount > 0 && (
                    <span style={{
                        backgroundColor: 'var(--color-orange)',
                        color: 'var(--color-white)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '12px',
                        padding: '3px 10px',
                        border: '2px solid var(--color-navy)',
                        boxShadow: '2px 2px 0 var(--color-navy)',
                    }}>
                        {unreadCount} UNREAD
                    </span>
                )}
            </div>

            {loading ? (
                <div className="admin-empty-state">FETCHING MESSAGES FROM DATABASE...</div>
            ) : messages.length === 0 ? (
                <div className="admin-empty-state">NO MESSAGES RECEIVED YET.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            style={{
                                backgroundColor: 'var(--color-white)',
                                border: '3px solid var(--color-navy)',
                                boxShadow: msg.read
                                    ? '4px 4px 0 var(--color-navy)'
                                    : '4px 4px 0 var(--color-navy)',
                                borderLeft: msg.read
                                    ? '3px solid var(--color-navy)'
                                    : '6px solid var(--color-orange)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Collapsed row — always visible */}
                            <div
                                onClick={() => handleExpand(msg)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '18px 20px',
                                    userSelect: 'none',
                                }}
                            >
                                {/* Unread dot */}
                                <span style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: msg.read ? 'transparent' : 'var(--color-orange)',
                                    border: msg.read ? '2px solid #ccc' : '2px solid var(--color-navy)',
                                    flexShrink: 0,
                                }} />

                                {/* Name */}
                                <span style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: 900,
                                    fontSize: '16px',
                                    textTransform: 'uppercase',
                                    minWidth: '140px',
                                    letterSpacing: '-0.01em',
                                }}>
                                    {msg.name}
                                </span>

                                {/* Email */}
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    color: 'var(--color-gray)',
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {msg.email}
                                </span>

                                {/* Preview of message */}
                                {expanded !== msg.id && (
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '12px',
                                        color: 'var(--color-navy)',
                                        opacity: 0.6,
                                        flex: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {msg.message}
                                    </span>
                                )}

                                {/* Date */}
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    color: 'var(--color-gray)',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}>
                                    {formatDate(msg.created_at)}
                                </span>

                                {/* Chevron */}
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '14px',
                                    fontWeight: 800,
                                    transform: expanded === msg.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                    flexShrink: 0,
                                }}>
                                    ▾
                                </span>
                            </div>

                            {/* Expanded body */}
                            {expanded === msg.id && (
                                <div style={{
                                    borderTop: '2px dashed var(--color-navy)',
                                    padding: '20px',
                                    backgroundColor: 'var(--color-bg)',
                                }}>
                                    {/* From / Email row */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '24px',
                                        marginBottom: '16px',
                                        flexWrap: 'wrap',
                                    }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>FROM</div>
                                            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>
                                                {msg.name}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>EMAIL</div>
                                            <a
                                                href={`mailto:${msg.email}`}
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '13px',
                                                    fontWeight: 700,
                                                    color: 'var(--color-navy)',
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                {msg.email}
                                            </a>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.5, marginBottom: '2px' }}>RECEIVED</div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                                                {formatDate(msg.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message body */}
                                    <div style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '14px',
                                        lineHeight: 1.7,
                                        whiteSpace: 'pre-wrap',
                                        backgroundColor: 'var(--color-white)',
                                        border: '2px solid var(--color-navy)',
                                        padding: '16px',
                                        marginBottom: '16px',
                                    }}>
                                        {msg.message}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your message`}
                                            className="btn btn-teal"
                                            style={{ fontSize: '12px', padding: '8px 16px', textDecoration: 'none' }}
                                        >
                                            REPLY ↗
                                        </a>
                                        <button
                                            className="btn btn-danger"
                                            style={{ fontSize: '12px', padding: '8px 16px' }}
                                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                        >
                                            DELETE
                                        </button>
                                        {!msg.read && (
                                            <span style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10px',
                                                color: 'var(--color-orange)',
                                                fontWeight: 800,
                                            }}>
                                                ● MARKED AS READ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className={`toast ${showToast ? 'show' : ''}`} id="messages-toast">
                {toastMsg}
            </div>
        </div>
    );
}
