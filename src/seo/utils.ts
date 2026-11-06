/**
 * SEO Utility Functions
 *
 * Provides helper functions for generating page metadata, keywords, and descriptions
 * based on the centralized SEO database.
 */

import { keywords, descriptions } from './index';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manojgowda.iotkit.in';

/**
 * Get page-specific keywords
 */
export function getPageKeywords(
  category: keyof typeof keywords,
  additionalKeywords: string[] = []
): string[] {
  const baseKeywords = keywords[category] || [];
  return [...baseKeywords, ...additionalKeywords];
}

/**
 * Get page-specific description
 */
export function getPageDescription(category: keyof typeof descriptions): string {
  return descriptions.getDescription(category);
}

/**
 * Generate SEO metadata for a page
 */
export function getPageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  section?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const {
    title,
    description: customDescription,
    path = '/',
    keywords: customKeywords,
    section,
    type = 'website',
    publishedTime,
    modifiedTime,
    image,
    noIndex = false,
  } = options;

  const defaultDescription = descriptions.getDescription('homepage');
  const metaDescription = customDescription || defaultDescription;
  const canonicalUrl = `${siteUrl}${path}`;
  const imageUrl = image || descriptions.homepage[0];

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      type,
      url: canonicalUrl,
      title,
      description: metaDescription,
      siteName: 'Manoj Gowda',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [imageUrl],
      creator: '@manojgowdain',
    },
    ...(section && {
      openGraph: {
        ...{
          type,
          url: canonicalUrl,
          title,
          description: metaDescription,
          siteName: 'Manoj Gowda',
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        },
        section,
      },
    }),
    ...(publishedTime && {
      openGraph: {
        ...{ publishedTime },
      },
    }),
    ...(modifiedTime && {
      openGraph: {
        ...{ modifiedTime },
      },
    }),
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateBlogPostingSchema(data: {
  title: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  url: string;
}): any {
  const {
    title,
    description,
    datePublished,
    dateModified,
    image,
    authorName = 'Manoj Gowda',
    url,
  } = data;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description && { description }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(image && { image }),
    author: {
      '@type': 'Person',
      name: authorName,
      url,
    },
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://cdn.manojgowda.qzz.io/manojgowdaimg.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate JSON-LD structured data for a project/software application
 */
export function generateSoftwareApplicationSchema(data: {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  technologies?: string[];
  datePublished?: string;
  dateModified?: string;
}): any {
  const {
    name,
    description,
    image,
    url,
    technologies = [],
    datePublished,
    dateModified,
  } = data;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    ...(description && { description }),
    operatingSystem: 'Web, Cloud',
    applicationCategory: 'DeveloperApplication',
    ...(image && { image }),
    ...(url && { url }),
    ...(technologies.length > 0 && { featureList: technologies }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: 'Manoj Gowda',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Manoj Gowda',
      url: siteUrl,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}