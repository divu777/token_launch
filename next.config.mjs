/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "red-advisory-catfish-400.mypinata.cloud",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
