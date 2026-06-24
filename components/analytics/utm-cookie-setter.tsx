'use client';

import { useEffect } from 'react';

/**
 * On first page view, capture `utm_*` query params into cookies (30 days) so
 * subsequent lead submissions can attribute the original campaign.
 */
export default function UtmCookieSetter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    let hasNewUtm = false;
    utmKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${key}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Lax`;
        hasNewUtm = true;
      }
    });
    // Persist landing page referrer once per session.
    const landingKey = 'dt_landing_set';
    if (!sessionStorage.getItem(landingKey)) {
      sessionStorage.setItem(landingKey, '1');
    }
    void hasNewUtm;
  }, []);

  return null;
}
