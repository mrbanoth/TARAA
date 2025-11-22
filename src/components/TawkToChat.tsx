import { useEffect } from 'react';

export default function TawkToChat() {
    useEffect(() => {
        const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
        const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID;

        // Only load if both IDs are configured
        if (!propertyId || !widgetId) {
            return;
        }

        // Load Tawk.to script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        document.body.appendChild(script);

        // Cleanup function
        return () => {
            // Remove script when component unmounts
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return null; // This component doesn't render anything
}
