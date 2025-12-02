import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'cdn11.metasync.com' },
            { protocol: 'https', hostname: 'cdn15.metasync.com' },
            { protocol: 'https', hostname: 'cdn16.metasync.com' },
            { protocol: 'https', hostname: 'dl.airtable.com' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/_scalapay/widget.js',
                destination: 'https://cdn.scalapay.com/widget/scalapay-widget-loader.js',
            },
        ];
    },

    // --- SECCIÓN DE CSP COMPLETA Y DEFINITIVA ---
async headers() {
        // Definimos las directivas como un objeto para evitar errores de sintaxis en strings
        const cspDirectives = {
            "default-src": ["'self'"],
            "font-src": ["'self'", "https://fonts.gstatic.com", "https://b.stripecdn.com", "data:"],
            "script-src": [
                "'self'",
                "'unsafe-eval'",
                "'unsafe-inline'",
                "https://js.stripe.com",
                "https://maps.googleapis.com", 
                "https://*.sumup.com",
                "https://cdn.scalapay.com",
                "https://*.googletagmanager.com",
                "https://*.google-analytics.com",
                "https://connect.facebook.net",
                "https://va.vercel-scripts.com",
                "https://cdnjs.cloudflare.com",
                "https://cdn.optimizely.com",
                "https://*.hcaptcha.com",
                "https://googleads.g.doubleclick.net",
                "https://*.doubleclick.net"
            ],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.hcaptcha.com"],
            "img-src": ["'self'", "data:", "https:", "blob:", "https://b.stripecdn.com", "https://*.stripe.com"],
            "connect-src": [
                "'self'",
                "blob:",
                "https://buscorepuesto-de461a6f006a.herokuapp.com",
                "http://localhost:*",
                "ws://localhost:*",
                "https://api.stripe.com", // IMPORTANTE: API explícita
                "https://*.stripe.com",
                "https://m.stripe.network",
                "https://*.sumup.com",
                "https://*.scalapay.com",
                "https://api.scalapay.com", // Agregado para el error de Scalapay
                "https://*.googleapis.com",
                "https://identitytoolkit.googleapis.com",
                "https://nominatim.openstreetmap.org",
                "https://vitals.vercel-insights.com",
                "https://o4505238017015808.ingest.us.sentry.io",
                "https://*.google.com",
                "https://pay.google.com",
                "https://*.google-analytics.com",
                "https://*.googleadservices.com",
                "https://*.facebook.com",
                "https://cdn.optimizely.com",
                "https://*.hcaptcha.com",
                "https://googleads.g.doubleclick.net",
                "https://*.doubleclick.net",
                "https://*.google.cl"
            ],
            "frame-src": [
                "'self'",
                "https://js.stripe.com",
                "https://hooks.stripe.com",
                "https://checkout.stripe.com", // Necesario para elementos nuevos
                "https://*.stripe.com",
                "https://*.sumup.com",
                "https://*.scalapay.com",
                "https://*.googletagmanager.com",
                "https://*.facebook.com",
                "https://*.hcaptcha.com",
                "https://pay.google.com",
                "https://www.google.com",
                "https://*.google.com",
                "https://*.doubleclick.net"
            ],
            "worker-src": ["'self'", "blob:", "https://m.stripe.network", "https://cdnjs.cloudflare.com"],
            "child-src": ["'self'", "blob:", "https://js.stripe.com", "https://*.sumup.com", "https://www.google.com", "https://*.google.com", "https://pay.google.com"],
            "manifest-src": ["'self'", "https://pay.google.com", "https://*.google.com"],
            "form-action": ["'self'", "https://*.facebook.com"],
            "base-uri": ["'self'"],
            "object-src": ["'none'"],
            "upgrade-insecure-requests": []
        };

        // Convertimos el objeto a string CSP válido
        const cspString = Object.entries(cspDirectives)
            .map(([key, values]) => {
                if (values.length === 0) return key;
                return `${key} ${values.join(' ')}`;
            })
            .join('; ');

        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspString,
                    },
                ],
            },
        ];
    },
};


export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

	org: 'buscorepuestos',
	project: 'javascript-nextjs',

// Only print logs for uploading source maps in CI
	silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
	hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
})
