/*
 * StreetPulse GA4 initialization.
 * This file is the single source of truth for analytics bootstrap.
 */
(function () {
  const GA4_MEASUREMENT_ID = 'G-6537MGFHJK';
  const ALLOWED_PROD_HOSTS = new Set(['streetpulse.ai', 'www.streetpulse.ai']);

  window.STREETPULSE_GA4_ID = GA4_MEASUREMENT_ID;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());

  const isProdHost = ALLOWED_PROD_HOSTS.has(window.location.hostname);
  window.gtag('config', GA4_MEASUREMENT_ID, {
    // Keep a single config call and explicitly control page_view behavior.
    send_page_view: true,
    // Production-safety: send analytics from non-prod hosts without writing cross-site cookies.
    cookie_domain: isProdHost ? 'auto' : 'none'
  });
})();
