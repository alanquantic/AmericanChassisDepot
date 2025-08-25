import { useEffect, useRef } from 'react';
import { getCurrentLanguage } from '@/lib/i18n-simple';

const ElevenLabsWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const currentLanguage = getCurrentLanguage();
    
    // Solo mostrar el widget en inglés
    if (currentLanguage !== 'en') {
      return;
    }

    // Crear el elemento del widget
    const widgetElement = document.createElement('elevenlabs-convai');
    widgetElement.setAttribute('agent-id', 'agent_4601k3425gfwey8t8mncjbe6fnya');
    
    // Agregar el widget al contenedor
    if (widgetRef.current) {
      widgetRef.current.appendChild(widgetElement);
    }

    // Cargar el script de ElevenLabs
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    // Agregar el script al head
    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      // Remover el script cuando el componente se desmonte
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      
      // Remover el widget
      if (widgetRef.current && widgetRef.current.firstChild) {
        widgetRef.current.removeChild(widgetRef.current.firstChild);
      }
    };
  }, []);

  // Solo renderizar el contenedor si estamos en inglés
  const currentLanguage = getCurrentLanguage();
  if (currentLanguage !== 'en') {
    return null;
  }

  return <div ref={widgetRef} className="elevenlabs-widget-container" />;
};

export default ElevenLabsWidget;
