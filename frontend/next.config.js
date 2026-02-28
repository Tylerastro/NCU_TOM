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
    // Optimize barrel file imports for large libraries (Rule 2.1 - CRITICAL)
    // This transforms `import { X } from 'lib'` to direct imports at build time
    // Reduces dev boot time by 15-70%, builds by 28%, cold starts by 40%
    experimental: {
      optimizePackageImports: [
        'lucide-react',
        '@heroicons/react',
        'react-icons',
        'date-fns',
        '@radix-ui/react-icons',
        'recharts',
      ],
    },
}

module.exports = nextConfig
