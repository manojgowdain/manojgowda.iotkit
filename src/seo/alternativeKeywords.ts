/**
 * Centralized Alternative Keywords Database
 *
 * Contains synonyms, related terms, conversational phrases, and semantic
 * variations to improve content coverage and natural language search targeting.
 *
 * Total: 115 alternative keywords across 10 categories
 */

export const alternativeKeywords = {
  /**
   * Synonyms for core technical roles and concepts
   */
  synonyms: [
    "software developer",
    "programmer",
    "coder",
    "tech lead",
    "principal engineer",
    "senior software engineer",
    "engineering lead",
    "full stack programmer",
    "backend engineer",
    "frontend engineer",
    "cloud architect",
    "DevOps specialist",
    "site reliability engineer",
    "infrastructure engineer",
    "platform engineer",
  ],

  /**
   * Conversational search phrases (natural language queries)
   */
  conversational: [
    "what does a software engineer do",
    "how to build web applications",
    "best practices for full stack development",
    "learning Docker and Kubernetes",
    "AWS cloud infrastructure tips",
    "how to start a career in DevOps",
    "TypeScript vs JavaScript",
    "React or Vue framework",
    "containerization explained",
    "what is Terraform used for",
    "how to learn cloud computing",
    "career path for senior developers",
    "best tools for backend development",
    "how to write clean code",
    "technical mentorship programs",
    "building your first web app",
    "how to deploy to AWS",
    "Docker tutorial for beginners",
    "Kubernetes in production",
    "database design best practices",
  ],

  /**
   * Question-based search phrases
   */
  questions: [
    "what is full-stack development",
    "how to learn Next.js",
    "what is DevOps culture",
    "how to containerize applications",
    "what is Terraform infrastructure",
    "how to optimize PostgreSQL queries",
    "what is React SSR",
    "how to build API with Node.js",
    "what is Supabase used for",
    "how to deploy React applications",
    "what is Kubernetes orchestration",
    "how to write TypeScript",
    "what is CI/CD pipeline",
    "how to design databases",
    "what is microservices architecture",
  ],

  /**
   * Semantic variations and related terms
   */
  semantic: [
    "web programming",
    "application development",
    "software architecture",
    "system design",
    "code quality",
    "technical documentation",
    "software craftsmanship",
    "developer productivity",
    "engineering excellence",
    "code maintainability",
    "test-driven development",
    "refactoring code",
    "technical debt",
    "software patterns",
    "design principles",
    "domain-driven design",
    "event sourcing",
    "command query separation",
    "api first design",
    "open source contribution",
  ],

  /**
   * Alternative spellings and common variations
   */
  variations: [
    "NextJS",
    "Nextjs",
    "ReactJS",
    "React.js",
    "NodeJS",
    "Node.js",
    "TypeScript",
    "Typescript",
    "JavaScript",
    "Javascript",
    "Bengaluru",
    "Bangalore",
    "backend",
    "backend-end",
    "frontend",
    "front-end",
    "fullstack",
    "full-stack",
  ],

  /**
   * Industry terminology and jargon
   */
  industry: [
    "senior engineer",
    "staff engineer",
    "engineering manager",
    "tech lead",
    "principal developer",
    "software craftsman",
    "engineering consultant",
    "technical advisor",
    "architecture review",
    "code quality audit",
    "technical mentorship",
    "engineering onboarding",
    "development team",
    "software team",
    "tech stack",
    "programming languages",
    "development frameworks",
    "cloud services",
    "serverless",
    "backend as a service",
  ],

  /**
   * Tool and technology alternative names
   */
  tools: [
    "React framework",
    "Next.js app",
    "Node server",
    "Express server",
    "Prisma ORM",
    "PostgreSQL database",
    "Redis cache",
    "AWS EC2",
    "AWS Lambda",
    "AWS S3",
    "Docker containers",
    "Kubernetes pods",
    "Terraform scripts",
    "GitHub Actions",
    "CI workflow",
    "deployment pipeline",
    "monitoring stack",
    "logging system",
    "observability",
    "APM tools",
  ],

  /**
   * Project and product terms
   */
  projects: [
    "web application",
    "mobile application",
    "dashboard",
    "admin panel",
    "content management",
    "blog platform",
    "project showcase",
    "portfolio site",
    "landing page",
    "feature release",
    "product launch",
    "MVP development",
    "prototype",
    "POC",
    "technical demo",
    "open source tool",
    "engineering tool",
    "utility library",
    "cli tool",
    "sdk development",
  ],

  /**
   * Career and professional development terms
   */
  career: [
    "software career",
    "engineering career path",
    "technical leadership",
    "senior developer skills",
    "mid-level engineer",
    "junior developer growth",
    "coding bootcamp",
    "self-taught programmer",
    "career switch to tech",
    "developer salary",
    "engineering job market",
    "technical interview prep",
    "coding skills",
    "programming skills",
    "software development lifecycle",
  ],

  /**
   * Blog and content-related phrases
   */
  content: [
    "technical article",
    "engineering blog post",
    "tutorial",
    "how-to guide",
    "best practices",
    "code example",
    "sample project",
    "demo app",
    "learning resource",
    "documentation",
    "technical writeup",
    "notes from the field",
    "lessons learned",
    "engineering insights",
    "thoughts on software",
    "coding experience",
    "development workflow",
    "tooling setup",
    "development environment",
    "local development",
  ],

  /**
   * Client and collaboration terms
   */
  clients: [
    "tech startup",
    "early stage startup",
    "software team",
    "engineering team",
    "product team",
    "CTO",
    "tech founder",
    "product manager",
    "venture studio",
    "incubator",
    "accelerator",
    "outsourced development",
    "remote engineer",
    "contract developer",
    "consulting engagement",
  ]
} as const;

// Export all alternative keywords as a flattened array
export const allAlternativeKeywords = Object.values(alternativeKeywords).flat();

// Export keyword count for validation
export const alternativeKeywordCount = allAlternativeKeywords.length;

// Export category counts
export const alternativeCategoryCounts = {
  synonyms: alternativeKeywords.synonyms.length,
  conversational: alternativeKeywords.conversational.length,
  questions: alternativeKeywords.questions.length,
  semantic: alternativeKeywords.semantic.length,
  variations: alternativeKeywords.variations.length,
  industry: alternativeKeywords.industry.length,
  tools: alternativeKeywords.tools.length,
  projects: alternativeKeywords.projects.length,
  career: alternativeKeywords.career.length,
  content: alternativeKeywords.content.length,
  clients: alternativeKeywords.clients.length,
};

// Export total count
export const totalAlternativeKeywordCount = Object.values(alternativeCategoryCounts)
  .reduce((sum, count) => sum + count, 0);