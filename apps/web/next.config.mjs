/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fixiq/shared', '@fixiq/validation'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL
          ? `${process.env.API_URL}/api/:path*`
          : 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
