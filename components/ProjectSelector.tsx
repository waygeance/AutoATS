import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  bullets: string[];
}

interface ProjectSelectorProps {
  jobDescription: string;
  onSubmit: (selectedProjects: string[]) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  jobDescription,
  onSubmit,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Sample project pool - in a real app, this would come from a database or API
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
      skills: [
        "Next.js",
        "TypeScript",
        "Socket.io",
        "OpenAI API",
        "PostgreSQL",
      ],
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
      skills: [
        "Python",
        "TensorFlow",
        "scikit-learn",
        "Apache Kafka",
        "Docker",
      ],
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
      skills: [
        "Vue.js",
        "D3.js",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "WebSocket",
      ],
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
      skills: [
        "Jenkins",
        "Docker",
        "Kubernetes",
        "AWS",
        "Terraform",
        "Ansible",
      ],
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

  useEffect(() => {
    // Simulate loading projects
    setTimeout(() => {
      setProjects(sampleProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnalyzeJD = async () => {
    setAnalyzing(true);
    try {
      // Call AI to analyze JD and suggest projects
      const response = await fetch("/api/analyze-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();
      if (data.recommendedProjects) {
        setSelectedProjects(data.recommendedProjects);
      }
    } catch (error) {
      console.error("Error analyzing JD:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSubmit = () => {
    if (selectedProjects.length > 0) {
      onSubmit(selectedProjects);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Step 2: Select Relevant Projects
      </h2>

      <div className="mb-6">
        <button
          onClick={handleAnalyzeJD}
          disabled={analyzing}
          className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {analyzing ? "Analyzing..." : "Auto-select for this JD"}
        </button>
        <p className="mt-2 text-sm text-gray-500">
          We’ll pick the most relevant projects based on the job description.
          You can still adjust.
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedProjects.includes(project.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleProjectToggle(project.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{project.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => handleProjectToggle(project.id)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {selectedProjects.length} project
          {selectedProjects.length !== 1 ? "s" : ""} selected
        </span>
        <button
          onClick={handleSubmit}
          disabled={selectedProjects.length === 0}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate Resume →
        </button>
      </div>
    </div>
  );
};

export default ProjectSelector;
