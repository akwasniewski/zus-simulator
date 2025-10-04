
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Warning: this allows production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

