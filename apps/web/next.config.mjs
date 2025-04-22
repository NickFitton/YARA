import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["md", "mdx", "tsx", "ts"],
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
