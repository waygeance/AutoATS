import type { NextApiRequest, NextApiResponse } from "next";

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  bullets: string[];
}

// Sample project pool - same as in the component
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform with MERN Stack",
    description:
      "Full-stack e-commerce solution with real-time inventory management",
    skills: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe API"],
    bullets: [
      "Built responsive frontend with React and Redux for state management",
      "Implemented secure payment processing using Stripe API",
      "Developed RESTful APIs with Express.js and MongoDB",
      "Achieved 99.9% uptime with automated deployment pipeline",
    ],
  },
  {
    id: "2",
    title: "AI-Powered Chat Application",
    description:
      "Real-time chat app with natural language processing capabilities",
    skills: ["Next.js", "TypeScript", "Socket.io", "OpenAI API", "PostgreSQL"],
    bullets: [
      "Implemented real-time messaging using WebSocket connections",
      "Integrated AI-powered message suggestions and auto-completion",
      "Built scalable backend architecture handling 10K+ concurrent users",
      "Reduced message latency by 40% through optimization",
    ],
  },
  {
    id: "3",
    title: "Cloud-Native Microservices Architecture",
    description: "Distributed system using Docker, Kubernetes, and AWS",
    skills: ["Docker", "Kubernetes", "AWS", "Go", "gRPC", "Redis"],
    bullets: [
      "Designed and implemented 15+ microservices with Go and gRPC",
      "Deployed containerized applications on Kubernetes cluster",
      "Achieved 99.99% availability with automated scaling and monitoring",
      "Reduced infrastructure costs by 30% through optimization",
    ],
  },
  {
    id: "4",
    title: "Machine Learning Pipeline for Fraud Detection",
    description: "Real-time fraud detection system using ML models",
    skills: ["Python", "TensorFlow", "scikit-learn", "Apache Kafka", "Docker"],
    bullets: [
      "Developed ML models with 95% accuracy in fraud detection",
      "Built real-time data processing pipeline with Apache Kafka",
      "Implemented model monitoring and retraining automation",
      "Reduced false positives by 60% through ensemble methods",
    ],
  },
  {
    id: "5",
    title: "Progressive Web App (PWA) for Social Media",
    description:
      "Offline-first social media application with push notifications",
    skills: [
      "React",
      "Service Workers",
      "IndexedDB",
      "Firebase",
      "Tailwind CSS",
    ],
    bullets: [
      "Built PWA with offline functionality and background sync",
      "Implemented push notifications for real-time engagement",
      "Achieved 95+ Lighthouse performance score",
      "Increased user retention by 45% with offline capabilities",
    ],
  },
  {
    id: "6",
    title: "Blockchain-Based Supply Chain Management",
    description: "Decentralized supply chain tracking using smart contracts",
    skills: ["Solidity", "Web3.js", "Ethereum", "React", "IPFS"],
    bullets: [
      "Developed smart contracts for transparent supply chain tracking",
      "Built web interface using React and Web3.js",
      "Implemented IPFS for decentralized file storage",
      "Reduced tracking errors by 80% through blockchain verification",
    ],
  },
  {
    id: "7",
    title: "Real-Time Analytics Dashboard",
    description:
      "Interactive dashboard for business intelligence and data visualization",
    skills: ["Vue.js", "D3.js", "Node.js", "PostgreSQL", "Redis", "WebSocket"],
    bullets: [
      "Created interactive data visualizations with D3.js",
      "Implemented real-time data updates using WebSocket connections",
      "Built responsive dashboard with 20+ different chart types",
      "Improved decision-making speed by 50% with real-time insights",
    ],
  },
  {
    id: "8",
    title: "Mobile App with React Native",
    description: "Cross-platform mobile application for fitness tracking",
    skills: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
    bullets: [
      "Developed cross-platform app for iOS and Android",
      "Integrated Firebase for real-time data synchronization",
      "Implemented offline data storage and synchronization",
      "Achieved 4.8-star rating with 50K+ downloads",
    ],
  },
  {
    id: "9",
    title: "DevOps Automation Pipeline",
    description: "CI/CD pipeline with automated testing and deployment",
    skills: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform", "Ansible"],
    bullets: [
      "Built end-to-end CI/CD pipeline with Jenkins and Docker",
      "Implemented infrastructure as code using Terraform",
      "Automated testing and deployment processes",
      "Reduced deployment time by 70% through automation",
    ],
  },
  {
    id: "10",
    title: "GraphQL API Gateway",
    description: "Unified API gateway using GraphQL and microservices",
    skills: ["GraphQL", "Apollo Server", "Node.js", "Redis", "Docker"],
    bullets: [
      "Designed and implemented GraphQL schema for 10+ microservices",
      "Built efficient data fetching with Apollo Server",
      "Implemented caching layer with Redis for performance",
      "Reduced API response time by 60% with GraphQL optimization",
    ],
  },
  {
    id: "11",
    title: "IoT Smart Home System",
    description: "Connected home automation system with mobile app control",
    skills: ["Python", "Raspberry Pi", "MQTT", "React Native", "AWS IoT"],
    bullets: [
      "Developed IoT firmware for smart home devices",
      "Built mobile app for device control and monitoring",
      "Implemented secure communication using MQTT protocol",
      "Achieved 99.9% system uptime with automated monitoring",
    ],
  },
  {
    id: "12",
    title: "Video Streaming Platform",
    description: "Scalable video streaming service with adaptive bitrate",
    skills: ["Node.js", "FFmpeg", "AWS S3", "CloudFront", "React", "WebRTC"],
    bullets: [
      "Built video processing pipeline with FFmpeg",
      "Implemented adaptive bitrate streaming for optimal quality",
      "Developed real-time video chat using WebRTC",
      "Supported 10K+ concurrent viewers with CDN optimization",
    ],
  },
];

async function callOllama(prompt: string): Promise<string> {
  const ollamaUrl =
    process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

  try {
    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || "";
  } catch (error) {
    console.error("Error calling Ollama:", error);
    throw error;
  }
}

function extractKeywordsFromJD(jobDescription: string): string[] {
  // Extract technical keywords, skills, and technologies from JD
  const keywords = new Set<string>();

  // Common tech keywords to look for
  const techKeywords = [
    "react",
    "nodejs",
    "node.js",
    "javascript",
    "typescript",
    "python",
    "java",
    "aws",
    "docker",
    "kubernetes",
    "k8s",
    "mongodb",
    "postgresql",
    "mysql",
    "redis",
    "graphql",
    "rest",
    "api",
    "microservices",
    "devops",
    "ci/cd",
    "git",
    "github",
    "azure",
    "gcp",
    "cloud",
    "machine learning",
    "ml",
    "ai",
    "data science",
    "frontend",
    "backend",
    "full-stack",
    "fullstack",
    "mobile",
    "ios",
    "android",
    "vue",
    "angular",
    "next.js",
    "express",
    "django",
    "flask",
    "spring",
    "linux",
    "ubuntu",
    "security",
    "testing",
    "agile",
    "scrum",
  ];

  const lowerJD = jobDescription.toLowerCase();

  techKeywords.forEach((keyword) => {
    if (lowerJD.includes(keyword)) {
      keywords.add(keyword);
    }
  });

  // Extract specific patterns like years of experience
  const experienceMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
  if (experienceMatch) {
    keywords.add(`experience_${experienceMatch[1]}years`);
  }

  return Array.from(keywords);
}

function scoreProjectRelevance(project: Project, jdKeywords: string[]): number {
  let score = 0;
  const projectText = `${project.title} ${
    project.description
  } ${project.skills.join(" ")}`.toLowerCase();

  jdKeywords.forEach((keyword) => {
    if (projectText.includes(keyword.toLowerCase())) {
      score += 1;
    }
  });

  // Bonus for projects with more matching skills
  const matchingSkills = project.skills.filter((skill) =>
    jdKeywords.some((keyword) =>
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  score += matchingSkills.length * 0.5;

  return score;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "Job description is required" });
    }

    // Extract keywords from job description
    const jdKeywords = extractKeywordsFromJD(jobDescription);

    let recommendedProjects: string[] = [];

    try {
      // Try to use Ollama for intelligent analysis
      const prompt = `
Given this job description, analyze and recommend the most relevant projects from a pool of 12 projects.
Focus on matching technical skills, experience level, and project complexity.

Job Description:
${jobDescription}

Available Projects:
${sampleProjects
  .map((p) => `${p.id}: ${p.title} - Skills: ${p.skills.join(", ")}`)
  .join("\n")}

Return only the project IDs (as numbers) that are most relevant, separated by commas. Maximum 5 projects.
`;

      const ollamaResponse = await callOllama(prompt);
      const projectIds = ollamaResponse.match(/\d+/g);

      if (projectIds && projectIds.length > 0) {
        recommendedProjects = projectIds.slice(0, 5).map((id) => id.trim());
      }
    } catch (ollamaError) {
      console.error(
        "Ollama analysis failed, using keyword matching:",
        ollamaError
      );

      // Fallback to keyword-based scoring
      const scoredProjects = sampleProjects.map((project) => ({
        id: project.id,
        score: scoreProjectRelevance(project, jdKeywords),
      }));

      scoredProjects.sort((a, b) => b.score - a.score);
      recommendedProjects = scoredProjects.slice(0, 5).map((p) => p.id);
    }

    res.status(200).json({
      recommendedProjects,
      keywords: jdKeywords,
      analysisMethod: recommendedProjects.length > 0 ? "ai" : "keyword",
    });
  } catch (error) {
    console.error("Error analyzing JD:", error);
    res.status(500).json({ error: "Failed to analyze job description" });
  }
}
