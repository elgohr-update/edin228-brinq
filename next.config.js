/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ['cdn.brinq.io'], //Domain of image host
  },
  reactStrictMode: true,
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  env: {
      NEXT_PUBLIC_ENV: 'PRODUCTION', //your next configs goes here
  },
})