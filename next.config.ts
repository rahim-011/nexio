
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
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

export default withBundleAnalyzer(nextConfig);
