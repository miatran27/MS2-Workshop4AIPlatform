/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow larger payloads for image uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
