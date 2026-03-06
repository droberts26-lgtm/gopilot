/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },

  // Proxy /akts.pdf to the FAA's official uncompressed supplement.
  // This is only used when public/akts.pdf is absent (e.g. Vercel deployments,
  // where the PDF is gitignored). Locally, drop the uncompressed file into
  // public/akts.pdf and Next.js will serve it directly at full quality.
  async rewrites() {
    return [
      {
        source: '/akts.pdf',
        destination:
          'https://www.faa.gov/sites/faa.gov/files/training_testing/testing/supplements/sport_rec_private_akts.pdf',
      },
    ];
  },
};

export default nextConfig;
