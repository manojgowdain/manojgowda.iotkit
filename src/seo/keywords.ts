/**
 * Centralized SEO Keyword Database
 *
 * This file contains categorized SEO keywords relevant to Manoj Gowda's professional
 * portfolio, including full-stack development, DevOps, cloud infrastructure, and IoT expertise.
 *
 * Total: 105 primary keywords across 8 categories
 */

export const keywords = {
  /**
   * Primary brand and identity keywords
   */
  primary: [
    "Manoj Gowda",
    "Manoj Gowda Software Engineer",
    "Manoj Gowda Team Lead",
    "Manoj Gowda Developer",
    "manojgowda.in",
    "manojgowda.iotkit.in",
    "manojgowda.in contact",
    "Manoj Gowda Bengaluru",
    "Manoj Gowda Engineer",
    "Manoj Gowda Full Stack",
  ],

  /**
   * Core technical expertise keywords - short tail
   */
  technical: [
    "full-stack development",
    "software engineering",
    "web development",
    "backend development",
    "frontend development",
    "React development",
    "Node.js development",
    "TypeScript development",
    "cloud infrastructure",
    "DevOps engineering",
  ],

  /**
   * Frontend and JavaScript framework keywords
   */
  frontend: [
    "React developer",
    "Next.js development",
    "React.js",
    "React Native developer",
    "Tailwind CSS",
    "shadcn/ui",
    "client-side rendering",
    "server-side rendering",
    "static site generation",
    "dynamic site generation",
  ],

  /**
   * Backend, database, and cloud infrastructure keywords
   */
  backend: [
    "Node.js engineer",
    "Express.js",
    "PostgreSQL development",
    "database design",
    "API development",
    "REST API",
    "GraphQL API",
    "Supabase development",
    "serverless architecture",
    "microservices",
  ],

  /**
   * Cloud and DevOps keywords
   */
  cloud: [
    "AWS developer",
    "AWS cloud engineer",
    "Amazon Web Services",
    "Docker containerization",
    "Kubernetes orchestration",
    "Terraform infrastructure",
    "CI/CD pipeline",
    "DevOps consultant",
    "cloud infrastructure",
    "AWS DevOps",
  ],

  /**
   * Database and data engineering keywords
   */
  database: [
    "PostgreSQL database",
    "database design",
    "data modeling",
    "Redis caching",
    "DynamoDB",
    "data architecture",
    "SQL development",
    "database optimization",
    "ORM Prisma",
    "database migration",
  ],

  /**
   * Industry and IoT specific keywords
   */
  industry: [
    "IoT development",
    "IoT platforms",
    "Android development",
    "mobile app development",
    "React Native apps",
    "cloud IoT solutions",
    "connected devices",
    "embedded systems",
    "API integration",
    "technology consulting",
  ],

  /**
   * Long-tail keywords targeting specific services and projects
   */
  longTail: [
    "full-stack web applications development",
    "cloud infrastructure design and deployment",
    "CI/CD pipeline setup and automation",
    "Docker containerization for production",
    "Kubernetes cluster management",
    "Terraform infrastructure as code",
    "React and Next.js application development",
    "TypeScript full-stack development",
    "PostgreSQL database design and optimization",
    "GraphQL API development with Apollo",
    "DevOps culture implementation",
    "engineering team mentorship",
    "startup technical architecture",
    "scalable web application design",
    "real-time systems development",
    "event-driven architecture",
    "AWS cloud services integration",
    "Docker container orchestration",
    "monitoring and observability setup",
    "security-conscious development",
    "clean code architecture",
    "developer experience optimization",
    "technology mentorship Bangalore",
    "software engineering consulting",
    "independent engineering services",
    "startup engineering team lead",
    "product development from idea to production",
    "distributed systems design",
    "cloud-native application development",
    "serverless function development",
  ],

  /**
   * Commercial/intent keywords for services
   */
  commercial: [
    "hire software engineer",
    "full-stack developer services",
    "DevOps consulting",
    "AWS architect",
    "cloud infrastructure consultant",
    "technical team lead",
    "engineering mentorship",
    "software architecture design",
    "startup technical advisor",
    "code review services",
  ],

  /**
   * Informational and learning keywords
   */
  informational: [
    "software engineering lessons",
    "Next.js tutorial",
    "React best practices",
    "Docker tutorial",
    "Kubernetes learning",
    "Terraform guide",
    "AWS cloud computing",
    "DevOps practices",
    "TypeScript tips",
    "clean code principles",
  ],

  /**
   * Project-related keywords
   */
  projects: [
    "web applications",
    "mobile apps",
    "IoT platforms",
    "dashboard development",
    "API projects",
    "open source projects",
    "engineering tools",
    "developer utilities",
    "cloud solutions",
    "data visualization",
  ],

  /**
   * Blog and content-related keywords
   */
  blog: [
    "software engineering notes",
    "web development articles",
    "DevOps tutorials",
    "AWS guides",
    "Docker tutorials",
    "Kubernetes articles",
    "React tips",
    "TypeScript guides",
    "cloud computing articles",
    "engineering blog",
  ],

  /**
   * Contact and business keywords
   */
  contact: [
    "contact developer",
    "hire engineer",
    "get in touch",
    "software engineering collaboration",
    "technical consulting inquiry",
    "project collaboration",
    "team lead services",
  ]
} as const;

// Export all keyword categories as a flattened array for convenience
export const allKeywords = Object.values(keywords).flat();

// Export keyword count for validation
export const keywordCount = allKeywords.length;

// Export category counts
export const categoryCounts = {
  primary: keywords.primary.length,
  technical: keywords.technical.length,
  frontend: keywords.frontend.length,
  backend: keywords.backend.length,
  cloud: keywords.cloud.length,
  database: keywords.database.length,
  industry: keywords.industry.length,
  longTail: keywords.longTail.length,
  commercial: keywords.commercial.length,
  informational: keywords.informational.length,
  projects: keywords.projects.length,
  blog: keywords.blog.length,
  contact: keywords.contact.length,
};

// Export total count
export const totalKeywordCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);