import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/admin/',
        '/settings/',
        '/profile/',
        '/resume/',
        '/interview/',
        '/coding/',
        '/reports/',
        '/api/',
      ],
    },
    sitemap: 'https://candidra.ai/sitemap.xml',
  }
}
