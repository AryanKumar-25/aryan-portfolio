import { Suspense } from 'react';
import AdminLoginInner from './login-inner';

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="login-container">
                <div className="login-card">
                    <div className="admin-empty-state">LOADING...</div>
                </div>
            </div>
        }>
            <AdminLoginInner />
        </Suspense>
    );
}
