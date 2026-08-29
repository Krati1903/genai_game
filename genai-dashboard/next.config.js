/** @type {import('next').NextConfig} */
const nextConfig = {
  // Rewrites to proxy requests if needed
  async rewrites() {
    return {
      beforeFiles: [
        // Add rewrite rules here for proxying requests to cluster if needed
      ],
    };
  },
};

module.exports = nextConfig;
