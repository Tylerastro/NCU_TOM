/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'flowbite.s3.amazonaws.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
          }
        ],
      },
}

module.exports = nextConfig
