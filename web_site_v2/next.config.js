/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    removeConsole: true,},
  images: {
    domains: ['www.mdkforum.com','www.mymypic.net'],
  },

}

module.exports = nextConfig
