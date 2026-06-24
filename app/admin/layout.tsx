import { requireAdmin } from '@/lib/admin/guard';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Admin — Divine Travel',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userEmail={session.email} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar userEmail={session.email} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
