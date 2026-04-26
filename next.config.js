cat > ~/HYA-Terminal/next.config.ts << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'financialmodelingprep.com' },
      { protocol: 'https', hostname: 'static.finnhub.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        '@opentelemetry/exporter-jaeger',
        '@opentelemetry/sdk-node',
      ];
    }
    return config;
  },
};

export default nextConfig;
EOF
