/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'gateway.pinata.cloud',
      'red-advisory-catfish-400.mypinata.cloud', // Add this line
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pinata.cloud',
      },
    ],
  },
};

export default nextConfig;
