import { fetchSeoContext } from '@/lib/seo/metadata';
import { LeadsManager } from '@/components/admin/leads-manager';

export default async function AdminLeadsPage() {
  const { theme } = await fetchSeoContext('/');
  const whatsappNumber = theme?.whatsapp_number ?? '+919876543210';
  const adminEmail = ''; // server-supplied from session at admin layout level; client falls back

  return <LeadsManager whatsappNumber={whatsappNumber} adminEmail={adminEmail} />;
}
