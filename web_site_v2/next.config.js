/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
  i18n: {
    locales: ['en', 'zh-Hant-TW'],
    defaultLocale: 'en',
  },
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ['www.mdkforum.com', 'www.mymypic.net'],
  },

}

module.exports = nextConfig
