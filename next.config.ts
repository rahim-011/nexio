import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {protocol:'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  allowedDevOrigins: [
        "z3gz75vs-3000.uks1.devtunnels.ms",
    ],
    experimental: {
        serverActions: {
            allowedOrigins: [
                "localhost:3000",
            ],
        },
    },
};

export default nextConfig;
