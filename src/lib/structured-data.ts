/**
 * Server-side JSON-LD Structured Data Generators
 *
 * These functions generate schema.org JSON-LD for SEO.
 * All schemas are rendered server-side in the initial HTML.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manojgowda.iotkit.in';
const logoUrl = 'https://cdn.manojgowda.qzz.io/manojgowdaimg.svg';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Manoj Gowda',
  url: siteUrl,
  image: logoUrl,
  jobTitle: 'Team Lead & Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Independent / Startup Engineer',
  },
  email: ['mail@manojgowda.in', 'manojgowdabr89@gmail.com'],
  sameAs: [
    'https://www.linkedin.com/in/manojgowdain',
    'https://www.instagram.com/manojgowda.in',
    'https://github.com/manojgowdain',
    'https://manojgowda.iotkit.in',
    'https://manojgowda.in',
  ],
  knowsAbout: [
    'Full Stack Development',
    'DevOps',
    'React',
    'Node.js',
    'AWS',
    'Docker',
    'IoT Platforms',
    'Android Development',
    'React Native',
    'Cloud Infrastructure',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bengaluru',
    addressCountry: 'IN',
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Manoj Gowda',
  url: siteUrl,
  publisher: {
    '@type': 'Person',
    name: 'Manoj Gowda',
    url: siteUrl,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Manoj Gowda — Developer, builder, curious human',
  description: 'The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.',
  url: siteUrl,
  publisher: {
    '@type': 'Person',
    name: 'Manoj Gowda',
    url: siteUrl,
  },
  author: {
    '@type': 'Person',
    name: 'Manoj Gowda',
    url: siteUrl,
  },
};

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateBlogPostingSchema(data: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string;
  authorName: string;
  url: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Manoj Gowda',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    ...(data.tags?.length && { keywords: data.tags.join(', ') }),
  };
}

export function generateSoftwareApplicationSchema(data: {
  name: string;
  description: string;
  image: string;
  url: string;
  technologies: string[];
  datePublished: string;
  dateModified: string;
  projectUrl?: string;
  sourceUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    description: data.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, Cloud',
    image: data.image,
    url: data.projectUrl || data.url,
    ...(data.sourceUrl && { codeRepository: data.sourceUrl }),
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
    featureList: data.technologies,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
  };
}

export function generateJobPostingSchema(data: {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    name: string;
    url: string;
  };
  jobLocation: {
    address: {
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
  };
  baseSalary?: {
    currency: string;
    value: { '@type': 'QuantitativeValue'; minValue: number; maxValue: number; unitText: string };
  };
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: data.title,
    description: data.description,
    datePosted: data.datePosted,
    validThrough: data.validThrough,
    employmentType: data.employmentType,
    hiringOrganization: data.hiringOrganization,
    jobLocation: data.jobLocation,
    ...(data.baseSalary && { baseSalary: data.baseSalary }),
    url: data.url,
  };
}