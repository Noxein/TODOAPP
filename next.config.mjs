/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['bcrypt'],
      },
    webpack: (config) => {
        config.externals = [...config.externals, 'bcrypt'];
        return config;
      },
      experimental: {
        serverActions: true,
      },
};

export default nextConfig;
