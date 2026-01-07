# AutoATS - AI-Powered Resume Builder

A modern, intelligent resume builder that uses AI to optimize your resume for specific job descriptions. Built with Next.js, TypeScript, and Tailwind CSS, powered by Ollama for local AI processing.

## ✨ Features

- 🤖 **AI-Powered Optimization**: Uses Ollama (LLaMA 3) to analyze job descriptions and optimize your resume
- 📝 **Smart Project Selection**: Automatically selects the most relevant projects from a pool of 12+ projects
- 🎯 **ATS-Friendly**: Generates resumes optimized for Applicant Tracking Systems
- 📄 **PDF Generation**: Generates a professional PDF (no LaTeX, no Docker)
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔒 **Privacy-First**: All AI processing happens locally with Ollama

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** with LLaMA 3 model (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd AutoATS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` to configure your settings:

   ```env
   # AI provider: ollama (recommended) or openai
   AI_PROVIDER=ollama

   # For Ollama (local LLaMA)
   OLLAMA_URL=http://localhost:11434/api/generate
   ```

4. **Install and setup Ollama**

   ```bash
   # Install Ollama
   curl -fsSL https://ollama.com/install.sh | sh

   # Pull LLaMA 3 model
   ollama pull llama3

   # Start Ollama service
   ollama serve
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Running

Run Ollama in one terminal:

```bash
ollama serve
```

Run the app in another:

```bash
npm run dev
```

## 📖 Usage Guide

### Step 1: Paste Job Description

- Copy and paste the complete job description
- Include requirements, responsibilities, and qualifications
- The more detailed, the better the AI optimization

### Step 2: AI-Powered Project Selection

- Click "🤖 AI-Powered Selection" to analyze the JD
- The AI will recommend the most relevant projects from your pool
- You can also manually select/deselect projects

### Step 3: Generate Resume

- Click "Generate Resume" to create your ATS-optimized resume
- The AI will:
  - Tailor your summary to match job requirements
  - Highlight relevant skills and experiences
  - Optimize content for ATS keywords
- Download a PDF (preview + download)

## 🏗️ Project Structure

```
AutoATS/
├── components/           # React components
│   ├── JobDescriptionForm.tsx
│   ├── ProjectSelector.tsx
│   └── ResultDisplay.tsx
├── pages/               # Next.js pages
│   ├── api/            # API endpoints
│   │   ├── analyze-jd.ts
│   │   └── generate-resume.ts
│   ├── _app.tsx
│   └── index.tsx
├── services/            # Legacy services (no longer required for PDF generation)
├── styles/             # CSS styles
│   └── globals.css
├── examples/           # Sample templates and profiles
└── docs/              # Additional documentation
```

## 🔧 Configuration

### AI Provider Options

#### Ollama (Recommended)

- Local processing, no API keys needed
- Uses LLaMA 3 model
- Complete privacy
- Free to use

#### OpenAI (Alternative)

- Requires API key
- Faster processing
- Cloud-based
- Usage costs apply

### Customization

#### Adding Your Own Projects

Edit the `sampleProjects` array in:

- `pages/api/analyze-jd.ts`
- `pages/api/generate-resume.ts`
- `components/ProjectSelector.tsx`

#### Customizing LaTeX Template

The system uses a professional ATS-friendly template. You can modify the LaTeX generation in:

- `pages/api/generate-resume.ts` (function `generateLatexTemplate`)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run tests
npm run lint             # Run linter
```

### API Endpoints

#### `POST /api/analyze-jd`

Analyzes job description and recommends relevant projects.

**Request:**

```json
{
  "jobDescription": "Full-stack developer position..."
}
```

**Response:**

```json
{
  "recommendedProjects": ["1", "3", "5"],
  "keywords": ["react", "node.js", "aws"],
  "analysisMethod": "ai"
}
```

#### `POST /api/generate-resume`

Generates optimized resume based on JD and selected projects.

**Request:**

```json
{
  "jobDescription": "Full-stack developer position...",
  "selectedProjects": ["1", "3", "5"]
}
```

**Response:**

```json
{
  "latex": "% LaTeX content...",
  "pdfUrl": "http://localhost:3030/pdf/1234567890.pdf",
  "selectedProjects": ["1", "3", "5"],
  "timestamp": "2024-01-06T15:30:00.000Z"
}
```

## 🔍 Troubleshooting

### Common Issues

#### Ollama Connection Failed

```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
ollama serve
```

#### LaTeX Compilation Errors

```bash
# Check LaTeX service status
curl http://localhost:3030/health

# Rebuild LaTeX service
npm run compile-service:build
npm run compile-service:run
```

#### Tailwind CSS Not Working

```bash
# Rebuild CSS
npm run build
```

### Getting Help

1. Check the console logs for detailed error messages
2. Ensure all services are running (web app, LaTeX service, Ollama)
3. Verify environment variables are correctly set
4. Check network connectivity for external services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) for local AI processing
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [LaTeX](https://www.latex-project.org/) for professional document generation

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Built with ❤️ for job seekers who want to stand out!**

## Running the Application

```bash
# Run the setup script
./setup.sh

# Then start services:
ollama serve                    # Start AI service
npm run compile-service:run     # Start LaTeX service  
npm run dev                    # Start web app
```

The application will be available at `http://localhost:3030` 
