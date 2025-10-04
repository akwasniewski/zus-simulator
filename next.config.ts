
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint checks during build
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Suppress certain warnings in client builds
      config.ignoreWarnings = [
        { message: /export .* was not found in/ }, // example: missing exports
        { message: /Critical dependency:/ },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;

