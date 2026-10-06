import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const config: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.nowfoods.com', pathname: '/sites/default/files/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-1633354129320-163fb10dd288' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-1745329532589-4f33352c4b10' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/photo-1731341400836-baaa5535b8d5' },
      { protocol: 'https', hostname: '*.supabase.co' },
      // Amazon product media. Note that the Associates Operating Agreement
      // expects product imagery to come through the Product Advertising API
      // rather than a direct CDN reference; once PA-API credentials exist,
      // getAmazonItems already returns Images.Primary.Large and these URLs
      // should be replaced with the API-supplied ones.
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      // Myprotein product imagery, served from THG's shared product CDN.
      { protocol: 'https', hostname: 'static.thcdn.com', pathname: '/productimg/**' },
      // Naked Nutrition product imagery, from its own Shopify store; Naked Egg
      // has no Amazon listing of its own to take an image from.
      { protocol: 'https', hostname: 'nakednutrition.com', pathname: '/cdn/shop/files/**' },
      // Bloom Nutrition's Shopify store, for its whey isolate image.
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/s/files/1/0143/0952/3556/**' },
      // Poster frames for our own YouTube videos (see lib/youtube.ts), served
      // through the optimiser so an unplayed video makes no request to Google.
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default withSentryConfig(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
