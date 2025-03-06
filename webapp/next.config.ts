import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    basePath: "/software-recommender", // GitHub Pages repository name
    assetPrefix: "/software-recommender/",
    env: {
        NEXT_PUBLIC_GEN_AI_API_KEY: process.env.NEXT_PUBLIC_GEN_AI_API_KEY,
    },
};

export default nextConfig;
