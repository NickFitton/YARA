import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "tsx", "ts"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
