import { createAdminClient } from '@/lib/supabase/server';

interface UpsertNavPoolArgs {
  module: string;
  entity_type: string;
  entity_id: string;
  label: string;
  url: string;
  cover_image?: string | null;
  badge_text?: string | null;
  is_published: boolean;
}

export async function upsertNavPool(args: UpsertNavPoolArgs) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('module_nav_pool')
    .upsert(
      {
        module: args.module,
        entity_type: args.entity_type,
        entity_id: args.entity_id,
        label: args.label,
        url: args.url,
        cover_image: args.cover_image ?? null,
        badge_text: args.badge_text ?? null,
        is_published: args.is_published,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'entity_type,entity_id' }
    );

  if (error) {
    console.error('[upsertNavPool]', error.message);
  }
}

export async function removeNavPool(entity_type: string, entity_id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('module_nav_pool')
    .delete()
    .eq('entity_type', entity_type)
    .eq('entity_id', entity_id);

  if (error) {
    console.error('[removeNavPool]', error.message);
  }
}

export function destinationToNavPool(dest: {
  id: string;
  name: string;
  nav_label?: string | null;
  slug: string;
  region: string;
  cover_image?: string | null;
  badge_text?: string | null;
  is_published: boolean;
}): UpsertNavPoolArgs {
  const regionSlug =
    dest.region === 'divine' ? 'divine-tours' :
    dest.region === 'domestic' ? 'domestic-tours' :
    'international-tours';

  return {
    module: `tours_${dest.region}`,
    entity_type: 'destination',
    entity_id: dest.id,
    label: dest.nav_label || dest.name,
    url: `/${regionSlug}/${dest.slug}`,
    cover_image: dest.cover_image,
    badge_text: dest.badge_text,
    is_published: dest.is_published,
  };
}

export function vehicleCategoryToNavPool(cat: {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
}): UpsertNavPoolArgs {
  return {
    module: 'vehicles',
    entity_type: 'vehicle_category',
    entity_id: cat.id,
    label: cat.name,
    url: `/vehicle-rentals/${cat.slug}`,
    is_published: cat.is_published,
  };
}

export function routeToNavPool(route: {
  id: string;
  from_city: string;
  to_city: string;
  slug: string;
  is_active: boolean;
  cover_image?: string | null;
}): UpsertNavPoolArgs {
  return {
    module: 'transfers',
    entity_type: 'transfer_route',
    entity_id: route.id,
    label: `${route.from_city} → ${route.to_city}`,
    url: `/airport-transfers/${route.slug}`,
    cover_image: route.cover_image,
    is_published: route.is_active,
  };
}
