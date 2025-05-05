

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    // List of locales supported by your application
    locales: ['en', 'de'],
    // Default locale when visiting a non-locale prefixed path
    defaultLocale: 'en',
    // Automatically redirect based on user's preferred locale
    localeDetection: true
  },
  experimental: {
    // Remove serverActions
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localeDetection: true // Set to boolean instead of string
  }
};

// Use async function wrapper for await
async function configWrapper() {
  return nextConfig;
}

module.exports = configWrapper();

