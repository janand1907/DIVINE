import { CmsPageForm } from '@/components/admin/cms-page-form';

export default function NewCmsPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">New CMS Page</h2>
        <p className="text-sm text-muted-foreground">Create a new dynamic landing page</p>
      </div>
      <CmsPageForm />
    </div>
  );
}
