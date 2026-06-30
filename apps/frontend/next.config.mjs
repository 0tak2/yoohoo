const nextConfig = {
  transpilePackages: ["@yoohoo/shared"],
  webpack(config) {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"]
    };
    return config;
  },
  experimental: {
    reactCompiler: true
  }
};

export default nextConfig;
