import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.nowfoods.com', pathname: '/sites/default/files/**' },
      { protocol: 'https', hostname: '*.supabase.co' },
      // Amazon product media. Note that the Associates Operating Agreement
      // expects product imagery to come through the Product Advertising API
      // rather than a direct CDN reference; once PA-API credentials exist,
      // getAmazonItems already returns Images.Primary.Large and these URLs
      // should be replaced with the API-supplied ones.
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
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
