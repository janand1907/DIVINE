import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Admin Login — Divine Travel',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-brand">
        <div className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4L12 16.8 5.7 21.4 8 14 2 9.4h7.6L12 2z" />
            </svg>
          </span>
          <h1 className="mt-3 font-heading text-2xl font-semibold text-foreground">Divine Travel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
