import type { ReactElement } from 'react';
import { jsonLdScript } from '@/lib/seo/json-ld';

export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Thin wrapper around lib/seo/json-ld's `jsonLdScript` helper so it can be
 * used as a layout-friendly React component. Renders a
 * `<script type="application/ld+json">` with the serialized JSON.
 */
export function JsonLd({ data }: JsonLdProps): ReactElement {
  return jsonLdScript(data);
}

/** Re-export for callers that prefer the function form. */
export { jsonLdScript };

export default JsonLd;
