import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin/api-guard';
import { logActivity } from '@/lib/activity/log';
import type { EnquiryFormConfigRow } from '@/types/database';

const enquiryFormConfigSchema = z.object({
  form_key: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional().nullable().or(z.literal('')),
  submit_label: z.string().default('Submit Enquiry'),
  success_message: z.string().default('Thank you!'),
  lead_source: z.string().default('contact'),
  lead_priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  module: z.string().optional().nullable().or(z.literal('')),
  notify_email: z
    .string()
    .email()
    .optional()
    .nullable()
    .or(z.literal('')),
  whatsapp_template: z.string().optional().nullable().or(z.literal('')),
  fields: z.any().array().default([]),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('enquiry_form_configs')
    .select()
    .eq('id', params.id)
    .single<EnquiryFormConfigRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = enquiryFormConfigSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const row = {
    ...parsed.data,
    description: parsed.data.description ?? undefined,
    module: parsed.data.module ?? undefined,
    notify_email: parsed.data.notify_email ?? undefined,
    whatsapp_template: parsed.data.whatsapp_template ?? undefined,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('enquiry_form_configs')
    .update(row)
    .eq('id', params.id)
    .select()
    .single<EnquiryFormConfigRow>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'update',
    entity: 'enquiry_form_config',
    entityId: data.id,
    metadata: { form_key: data.form_key, title: data.title },
    userEmail: email,
  });

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const { email } = session;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('enquiry_form_configs')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    action: 'delete',
    entity: 'enquiry_form_config',
    entityId: params.id,
    metadata: null,
    userEmail: email,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
