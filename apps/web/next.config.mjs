/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fixiq/shared', '@fixiq/validation'],
};

export default nextConfig;
