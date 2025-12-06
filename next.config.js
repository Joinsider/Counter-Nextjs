const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: i18n configuration in `next.config.js` is unsupported in the App Router.
  // See: https://nextjs.org/docs/app/building-your-application/routing/internationalization
  // If you need i18n with the App Router, configure translations at the app layer or
  // use an i18n library designed for the App Router.
};

// Only wrap with the bundle analyzer when explicitly requested to avoid
// introducing webpack customizations during normal builds (which can trigger
// Turbopack/webpack conflicts on Next.js 16+).
if (process.env.ANALYZE === 'true') {
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
