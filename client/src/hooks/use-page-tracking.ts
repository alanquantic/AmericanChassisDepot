import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageView, sendPageViewConversion } from '../lib/gtag';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Enviar vista de página a Google Analytics
    sendPageView(location.pathname + location.search);
    
    // Enviar evento de conversión de Google Ads para vista de página
    sendPageViewConversion();
  }, [location]);
}

// Hook específico para tracking de conversiones en páginas específicas
export function useConversionTracking(
  shouldTrack: boolean = true,
  conversionId?: string,
  conversionLabel?: string
) {
  const location = useLocation();

  useEffect(() => {
    if (shouldTrack && conversionId && conversionLabel) {
      // Importar dinámicamente para evitar errores de SSR
      import('../lib/gtag').then(({ sendGoogleAdsConversion }) => {
        sendGoogleAdsConversion(conversionId, conversionLabel, 1.0, 'USD');
      });
    }
  }, [location, shouldTrack, conversionId, conversionLabel]);
}
