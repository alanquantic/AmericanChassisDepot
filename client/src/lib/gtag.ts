// Google Analytics y Google Ads Event Tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Función para enviar evento de conversión de Google Ads
export function sendGoogleAdsConversion(
  conversionId: string,
  conversionLabel: string,
  value?: number,
  currency: string = 'USD'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${conversionId}/${conversionLabel}`,
      'value': value || 1.0,
      'currency': currency
    });
  }
}

// Función para enviar evento personalizado de Analytics
export function sendAnalyticsEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }
}

// Función para enviar evento de vista de página
export function sendPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-LGG57D1CLB', {
      'page_path': url
    });
  }
}

// Evento específico para vista de página (conversión)
export function sendPageViewConversion() {
  sendGoogleAdsConversion(
    'AW-17026781360',
    'kVxnCNf3jL0aELChgLc_',
    1.0,
    'USD'
  );
}

