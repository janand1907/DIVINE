import { PublicLayout } from '@/components/layout/public-layout';

export default async function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
