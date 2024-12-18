const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config options here
};

// Use async function wrapper for await
async function configWrapper() {
  await setupDevPlatform();
  return nextConfig;
}

module.exports = configWrapper();

