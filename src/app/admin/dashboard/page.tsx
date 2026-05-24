"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
    const router = useRouter();
    
    useEffect(() => {
        router.push('/admin/projects');
    }, [router]);

    return (
        <div className="admin-empty-state">
            REDIRECTING TO PROJECTS MANAGEMENT...
        </div>
    );
}
