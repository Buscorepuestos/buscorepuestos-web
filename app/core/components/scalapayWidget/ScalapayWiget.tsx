// // app/core/components/ScalapayWidget.tsx
// 'use client';

// import React, { useEffect } from 'react';
// import { environment } from '../../../environment/environment';

// // --- Interfaces y constantes (sin cambios) ---
// interface ScalapayWidgetProps {
//     amountSelector: string;
//     type?: 'product' | 'cart' | 'checkout';
//     locale?: 'it' | 'fr' | 'es' | 'en';
// }
// const INTEGRATION_MERCHANT_TOKEN = environment.scalapay_token_merchant || '';
// const INTEGRATION_ENVIRONMENT = environment.scalapay_environment || 'integration';
// interface ScalapayGlobal {
//     init: (config?: any) => void;
// }
// declare global {
//     interface Window {
//         Scalapay?: ScalapayGlobal;
//         _scalapayScriptLoadingPromise?: Promise<void>; // Nuestra promesa global
//     }
//     namespace JSX {
//         interface IntrinsicElements {
//             'scalapay-widget': {
//                 'amount-selectors': string;
//                 environment: string;
//                 'merchant-token': string;
//                 type: string;
//                 locale: string;
//             }
//         }
//     }
// }

// const SCALAPAY_SCRIPT_URL = "/_scalapay/widget.js?version=V5"; 
// const SCRIPT_ID = "scalapay-widget-script";

// // --- Lógica de carga centralizada ---
// const loadScalapayScript = (): Promise<void> => {
//     // Si la promesa ya existe (otro widget ya inició la carga), la devolvemos.
//     if (window._scalapayScriptLoadingPromise) {
//         console.log("[ScalapayScriptLoader] El script ya está en proceso de carga. Esperando...");
//         return window._scalapayScriptLoadingPromise;
//     }

//     // Si no, creamos una nueva promesa para controlar la carga.
//     console.log("[ScalapayScriptLoader] Iniciando la carga del script de Scalapay...");
//     window._scalapayScriptLoadingPromise = new Promise((resolve, reject) => {
//         // Comprobamos si el script ya está en el DOM por alguna razón externa.
//         if (document.getElementById(SCRIPT_ID)) {
//             console.log("[ScalapayScriptLoader] El script ya estaba en el DOM.");
//             // Si window.Scalapay ya existe, resolvemos inmediatamente.
//             if (window.Scalapay) {
//                 resolve();
//             } else {
//                 // Si el tag del script existe pero window.Scalapay no, esperamos un poco.
//                 setTimeout(() => {
//                     if (window.Scalapay) resolve();
//                     else reject(new Error("El script estaba en el DOM pero no se inicializó."));
//                 }, 500);
//             }
//             return;
//         }

//         const script = document.createElement('script');
//         script.id = SCRIPT_ID;
//         script.src = SCALAPAY_SCRIPT_URL;
//         script.type = "module";
//         script.async = true;

//         script.onload = () => {
//             console.log("✅ Script de Scalapay cargado y listo.");
//             resolve(); // La promesa se resuelve cuando el script se ha cargado.
//         };

//         script.onerror = () => {
//             console.error("[ScalapayScriptLoader] ERROR: No se pudo cargar el script.");
//             reject(new Error("Fallo al cargar el script de Scalapay"));
//         };

//         document.head.appendChild(script);
//     });

//     return window._scalapayScriptLoadingPromise;
// };

// // --- Componente Widget ---
// const ScalapayWidget: React.FC<ScalapayWidgetProps> = ({ amountSelector, type = 'product', locale = 'es' }) => {
//     const amountSelectorsString = JSON.stringify([amountSelector]);

//     useEffect(() => {
//         let isMounted = true;

//         const initialize = () => {
//             if (isMounted && window.Scalapay && typeof window.Scalapay.init === 'function') {
//                 console.log(`[ScalapayWidget] Inicializando widget tipo: ${type}`);
//                 window.Scalapay.init();
//             }
//         };

//         // Comprobamos si window.Scalapay ya está disponible (navegaciones rápidas).
//         if (window.Scalapay) {
//             initialize();
//         } else {
//             // Si no, usamos nuestra función de carga centralizada.
//             loadScalapayScript()
//                 .then(() => {
//                     // Cuando la promesa se resuelve, sabemos que es seguro inicializar.
//                     initialize();
//                 })
//                 .catch(error => {
//                     console.error(error);
//                 });
//         }
        
//         return () => { isMounted = false; };
//     }, [type, amountSelector]);

//     return (
//         <scalapay-widget
//             amount-selectors={amountSelectorsString}
//             environment={INTEGRATION_ENVIRONMENT}
//             merchant-token={INTEGRATION_MERCHANT_TOKEN}
//             type={type}
//             locale={locale}
//         />
//     );
// };

// export default ScalapayWidget;

'use client';

import React, { useEffect } from 'react';
import { environment } from '../../../environment/environment';

// --- Interfaces Locales ---
interface ScalapayWidgetProps {
    amountSelector: string;
    type?: 'product' | 'cart' | 'checkout';
    locale?: 'it' | 'fr' | 'es' | 'en';
}

// --- Constantes ---
const INTEGRATION_MERCHANT_TOKEN = environment.scalapay_token_merchant || '';
const INTEGRATION_ENVIRONMENT = environment.scalapay_environment || 'integration';
const SCALAPAY_SCRIPT_URL = "/_scalapay/widget.js?version=V5"; 
const SCRIPT_ID = "scalapay-widget-script";

// --- Lógica de carga del script (Singleton) ---
const loadScalapayScript = (): Promise<void> => {
    if (typeof window === 'undefined') return Promise.resolve();

    if (window._scalapayScriptLoadingPromise) {
        return window._scalapayScriptLoadingPromise;
    }

    window._scalapayScriptLoadingPromise = new Promise((resolve, reject) => {
        if (document.getElementById(SCRIPT_ID)) {
            if (window.Scalapay) {
                resolve();
            } else {
                setTimeout(() => {
                    if (window.Scalapay) resolve();
                    else reject(new Error("El script estaba en el DOM pero no se inicializó."));
                }, 500);
            }
            return;
        }

        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = SCALAPAY_SCRIPT_URL;
        script.type = "module";
        script.async = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = () => {
            console.error("[ScalapayWidget] ERROR: No se pudo cargar el script.");
            reject(new Error("Fallo al cargar el script de Scalapay"));
        };

        document.head.appendChild(script);
    });

    return window._scalapayScriptLoadingPromise;
};

// --- Componente Widget ---
const ScalapayWidget: React.FC<ScalapayWidgetProps> = ({ 
    amountSelector, 
    type = 'product', 
    locale = 'es' 
}) => {
    const amountSelectorsString = JSON.stringify([amountSelector]);

    useEffect(() => {
        let isMounted = true;

        const initialize = () => {
            if (isMounted && window.Scalapay && typeof window.Scalapay.init === 'function') {
                window.Scalapay.init();
            }
        };

        if (window.Scalapay) {
            initialize();
        } else {
            loadScalapayScript()
                .then(() => {
                    if (isMounted) initialize();
                })
                .catch(error => {
                    console.error("[ScalapayWidget] Error de inicialización:", error);
                });
        }
        
        return () => { isMounted = false; };
    }, [type, amountSelector]);

    return React.createElement('scalapay-widget', {
        'amount-selectors': amountSelectorsString,
        'environment': INTEGRATION_ENVIRONMENT,
        'merchant-token': INTEGRATION_MERCHANT_TOKEN,
        'type': type,
        'locale': locale
    });
};

export default ScalapayWidget;