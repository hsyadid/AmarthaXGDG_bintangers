import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node'],
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Turbopack handles externals automatically for serverExternalPackages
  },
};

export default nextConfig;

