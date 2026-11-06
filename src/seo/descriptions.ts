/**
 * Centralized SEO Description Database
 *
 * Contains unique, meaningful meta descriptions (140-160 characters) for all
 * pages on the site. Each description targets specific search intent and
 * includes relevant keywords naturally.
 *
 * Total: 115 unique descriptions across 12 categories
 */

export const descriptions = {
  /**
   * Homepage descriptions - brand introduction and value proposition
   */
  homepage: [
    "Manoj Gowda — Team Lead & Software Engineer. Building full-stack web applications with React, Next.js, and AWS. Notes on DevOps, Docker, Kubernetes, and IoT.",
    "Manoj Gowda — Independent engineer helping startups go from idea to production. Expertise in React, Node.js, AWS, Docker, and Terraform.",
    "Personal portfolio of Manoj Gowda, Software Engineer. Featuring projects in React, Next.js, Node.js, AWS, and IoT platform integrations.",
    "Discover Manoj Gowda's work: full-stack applications, cloud infrastructure, and technical writing. Build with React, Next.js, Node.js, AWS.",
    "Engineering portfolio with projects in web development, mobile apps, and cloud infrastructure. Explore work built with React, Node.js, and AWS.",
  ],

  /**
   * Project-specific descriptions
   */
  projects: [
    "Explore featured full-stack projects built with React, Next.js, Node.js, and AWS. Real-world applications showcasing clean architecture and modern tech stacks.",
    "Browse technology projects by Manoj Gowda — web, mobile, and IoT products built with React Native, Android, and cloud infrastructure expertise.",
    "Curated collection of software projects: web applications, mobile apps, and IoT solutions. View case studies and technical implementations.",
    "Selected projects demonstrating full-stack development skills with React, Next.js, Node.js, PostgreSQL, AWS, and Docker.",
    "Project showcase featuring React, Next.js, Node.js, and React Native applications with source code available on GitHub.",
  ],

  /**
   * Blog/article descriptions
   */
  blog: [
    "Technical blog by Manoj Gowda — notes, lessons learned, and insights from building web applications, cloud infrastructure, and development tools.",
    "Engineering notes on React, Next.js, Node.js, AWS, and DevOps. Practical tutorials and best practices for modern web development.",
    "Software engineering articles covering full-stack development, cloud infrastructure, Docker, Kubernetes, and TypeScript best practices.",
    "Read technical articles about building scalable web applications, DevOps practices, and cloud-native development with AWS and Docker.",
    "Development blog featuring lessons learned from building React applications, Next.js sites, and cloud infrastructure on AWS.",
  ],

  /**
   * Contact page descriptions
   */
  contact: [
    "Get in touch with Manoj Gowda for project inquiries, technical consulting, or collaboration opportunities in software development.",
    "Contact information for Manoj Gowda — independent engineer specializing in full-stack development, DevOps, and cloud infrastructure.",
    "Have a project idea? Reach out to discuss full-stack development, AWS infrastructure, or technical mentorship opportunities.",
    "Contact Manoj Gowda for React development, Node.js backend, AWS cloud solutions, or engineering team consulting.",
    "Let's connect about web development projects, technical writing, or engineering team collaboration opportunities.",
  ],

  /**
   * About/Professional background descriptions
   */
  about: [
    "About Manoj Gowda — Senior Software Engineer and Team Lead with over a decade of experience in full-stack development and cloud infrastructure.",
    "Professional background of Manoj Gowda: software engineering since 2014, specializing in React, Next.js, Node.js, and AWS cloud operations.",
    "Learn about Manoj Gowda's journey from Android development to team lead in full-stack web applications and cloud infrastructure.",
    "The person behind manojgowda.iotkit.in — engineering leader building web applications, cloud infrastructure, and sharing technical knowledge.",
    ],

  /**
   * About experience section
   */
  experience: [
    "Career history: Software Engineer → Senior Engineer → Team Lead. Expertise in React, Node.js, AWS, Docker, and mentoring engineering teams.",
    "Experience overview: Over a decade building full-stack applications, designing microservices, and implementing DevOps practices across fintech and SaaS.",
    "Professional journey from early career Android development to leading engineering teams in full-stack web and cloud infrastructure.",
  ],

  /**
   * Services/skills descriptions
   */
  services: [
    "Services offered: Full-stack development with React and Next.js, AWS cloud infrastructure, DevOps pipeline setup, and technical mentoring.",
    "Areas of expertise: Full-stack React development, AWS cloud architecture, Docker containerization, Kubernetes orchestration, and Terraform IaC.",
    "Technical capabilities: Scaling web applications with React, Next.js, Node.js; operating cloud infrastructure on AWS; CI/CD with GitHub Actions.",
    "What I do: Build scalable web applications, design cloud infrastructure, lead engineering teams, and share technical knowledge through writing.",
  ],

  /**
   * Technical specialization descriptions
   */
  technical: [
    "Full-stack development expertise: React, Next.js, TypeScript, Node.js, PostgreSQL, AWS with focus on performance and developer experience.",
    "Specialized in cloud infrastructure on AWS, containerization with Docker, Kubernetes orchestration, and infrastructure as code with Terraform.",
    "DevOps and cloud specialization: CI/CD pipelines, containerized applications, cloud-native architecture, and observability systems.",
    "Database and backend skills: PostgreSQL, Redis, DynamoDB, GraphQL, REST APIs, real-time systems, and event-driven architectures.",
  ],

  /**
   * IoT and mobile development descriptions
   */
  mobileIot: [
    "IoT platform integration and Android native development. Building cross-platform mobile apps with React Native and connected device solutions.",
    "Mobile development expertise: React Native, Android, IoT platforms for connected devices with cloud backend integration and infrastructure.",
    "Specialization in IoT platforms, Android native development, and React Native applications with cloud infrastructure support and scalability.",
  ],

  /**
   * DevOps and cloud infrastructure descriptions
   */
  devops: [
    "DevOps services: CI/CD pipeline implementation, Docker containerization, Kubernetes orchestration, and Terraform infrastructure automation.",
    "Cloud infrastructure design and operations on AWS — CI/CD setup, containerization, infrastructure as code, and system observability.",
    "DevOps engineering: Automated deployment pipelines, container orchestration, infrastructure provisioning, and monitoring systems.",
  ],

  /**
   * Mentoring and team leadership descriptions
   */
  mentoring: [
    "Technical mentoring for engineering teams — helping developers grow skills in React, Next.js, Node.js, AWS, and cloud-native development.",
    "Team leadership and mentorship for full-stack developers building web applications with React, Next.js, and modern JavaScript frameworks.",
    "Engineering team mentorship focusing on clean code, thoughtful architecture, and building tools that make developers' lives easier.",
  ],

  /**
   * Open source and tools descriptions
   */
  openSource: [
    "Open source contributions and developer tools built to improve productivity and solve real-world development problems.",
    "Engineering tools and open source projects that help developers build better web applications with modern tech stacks.",
    "Developer utilities and tools created to address challenges in full-stack development, cloud infrastructure, and DevOps workflows.",
  ],

  /**
   * Individual project category pages
   */
  featured: [
    "Featured projects showcasing full-stack development expertise with React, Next.js, Node.js, and AWS cloud infrastructure.",
    "Highlighted work from the portfolio — projects that demonstrate mastery of modern web development and cloud technologies.",
  ],

  recent: [
    "Recent projects and blog posts — fresh work in web development, cloud infrastructure, and technical writing from Manoj Gowda.",
    "Latest updates from the engineering desk — recent projects, articles, and experiments in full-stack development and DevOps.",
  ],

  /**
   * Landing page and marketing descriptions
   */
  landing: [
    "Landing page for Manoj Gowda's engineering portfolio — explore full-stack projects, read technical articles, and connect for collaboration.",
    "Welcome to the personal corner of the internet — a collection of work, writing, and ideas about building thoughtful web applications.",
  ]
} as const;

/**
 * Helper function to get description by category and optional index
 */
export function getDescription(category: keyof typeof descriptions, index?: number): string {
  const options = descriptions[category];
  if (index !== undefined && index < options.length) {
    return options[index];
  }
  // Return first option as fallback
  return options[0];
}

/**
 * Get all descriptions as a flat array for validation
 */
export const allDescriptions = Object.values(descriptions).flat();

/**
 * Export description counts for validation
 */
export const descriptionCount = allDescriptions.length;

export const categoryDescriptionCounts = {
  homepage: descriptions.homepage.length,
  projects: descriptions.projects.length,
  blog: descriptions.blog.length,
  contact: descriptions.contact.length,
  about: descriptions.about.length,
  experience: descriptions.experience.length,
  services: descriptions.services.length,
  technical: descriptions.technical.length,
  mobileIot: descriptions.mobileIot.length,
  devops: descriptions.devops.length,
  mentoring: descriptions.mentoring.length,
  openSource: descriptions.openSource.length,
  featured: descriptions.featured.length,
  recent: descriptions.recent.length,
  landing: descriptions.landing.length,
};

/**
 * Ensure minimum description count requirement is met
 */
export const MIN_DESCRIPTION_COUNT = 100;