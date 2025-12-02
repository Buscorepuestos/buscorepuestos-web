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
    const cspHeader = [
        "default-src 'self';",
        
        // ⚠️ CORREGIDO: font-src unificado con b.stripecdn.com
        "font-src 'self' https://fonts.gstatic.com https://b.stripecdn.com data:;",
        
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.sumup.com https://cdn.scalapay.com https://*.googletagmanager.com https://*.google-analytics.com https://connect.facebook.net https://va.vercel-scripts.com https://cdnjs.cloudflare.com https://cdn.optimizely.com https://*.hcaptcha.com https://googleads.g.doubleclick.net https://*.doubleclick.net;",
        
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.hcaptcha.com;",
        
        // ⚠️ ACTUALIZADO: Agregar blob y Stripe CDN
        "img-src 'self' data: https: blob: https://b.stripecdn.com https://*.stripe.com;",
        
        // ⚠️ ACTUALIZADO: Agregar m.stripe.com y m.stripe.network
        `connect-src 'self' blob: https://buscorepuesto-de461a6f006a.herokuapp.com http://localhost:* ws://localhost:* https://*.stripe.com https://m.stripe.com https://m.stripe.network https://*.sumup.com https://*.scalapay.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://nominatim.openstreetmap.org https://vitals.vercel-insights.com https://o4505238017015808.ingest.us.sentry.io https://*.google.com https://pay.google.com https://*.google-analytics.com https://*.googleadservices.com https://*.facebook.com https://cdn.optimizely.com https://*.hcaptcha.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.google.cl;`,
        
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.sumup.com https://*.scalapay.com https://*.googletagmanager.com https://*.facebook.com https://*.hcaptcha.com https://pay.google.com https://www.google.com https://*.google.com https://*.doubleclick.net;",
        
        "worker-src 'self' blob: https://cdnjs.cloudflare.com;",
        
        "child-src 'self' blob: https://js.stripe.com https://*.sumup.com https://www.google.com https://*.google.com https://pay.google.com;",
        
        "manifest-src 'self' https://pay.google.com https://*.google.com;",
        
        "form-action 'self' https://*.facebook.com;",
        "base-uri 'self';",
        "object-src 'none';",
        "frame-ancestors 'self';",
        "upgrade-insecure-requests;",
    ].join(' ');

    return [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'Content-Security-Policy',
                    value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
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
