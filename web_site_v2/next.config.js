/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  swcMinify: true,
  i18n,
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ['www.mdkforum.com', 'www.mymypic.net'],
  },
  output: 'standalone'

}

module.exports = nextConfig
