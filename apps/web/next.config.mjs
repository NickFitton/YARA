import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "tsx", "ts"],
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://placehold.co/300x150")],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
