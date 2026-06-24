'use client';

interface LogActivityClientArgs {
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
}

/** Best-effort client-side activity log. Silently fails. */
export async function logActivityClient(args: LogActivityClientArgs): Promise<void> {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
  } catch {
    // best-effort
  }
}
