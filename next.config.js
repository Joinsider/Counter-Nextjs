
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'de', 'by'],
    defaultLocale: 'en',
    localeDetection: false
  },
};

module.exports = withBundleAnalyzer(nextConfig);

