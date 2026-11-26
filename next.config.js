/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Self-hosted slide deck: a static page in public/, served at a clean URL.
      {
        source: '/ai-automation/research/slide-deck',
        destination: '/ai-automation/research/slide-deck.html',
      },
    ]
  },
}

module.exports = nextConfig
