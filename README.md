# AutoATS

AI-powered resume builder that optimizes your resume for specific job descriptions using local AI (Ollama). Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🤖 **AI-Powered Optimization**: Uses Ollama (LLaMA 3) to analyze job descriptions and optimize your resume
- 📝 **Smart Project Selection**: Automatically selects the most relevant projects from your pool
- 🎯 **ATS-Friendly**: Generates resumes optimized for Applicant Tracking Systems
- 📄 **PDF Generation**: Professional PDF output via local pdflatex (no Docker required)
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔒 **Privacy-First**: All AI processing happens locally with Ollama

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **pdflatex** (TeX Live)
3. **Ollama** with LLaMA 3 model

### One-Command Setup

```bash
./infra/setup.sh
```

This script will:

- Check for Node.js and install dependencies
- Verify pdflatex installation
- Check Ollama availability
- Offer to pull the llama3 model if missing

### Manual Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd AutoATS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install and setup Ollama**

   ```bash
   # Install Ollama
   curl -fsSL https://ollama.com/install.sh | sh

   # Pull LLaMA 3 model
   ollama pull llama3

   # Start Ollama service
   ollama serve
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Paste Job Description**: Copy and paste the complete job description
2. **Generate Resume**: Click "Generate Resume" - the AI will:
   - Select the most relevant projects from your pool
   - Tailor your summary to match job requirements
   - Optimize content for ATS keywords
3. **Download PDF**: Preview and download your optimized resume

## 🏗️ Repository Structure

```
AutoATS/
├── apps/web/              # Next.js frontend
│   ├── components/        # React components
│   ├── pages/            # Next.js pages and API routes
│   ├── styles/           # CSS styles
│   ├── __tests__/        # Tests
│   └── examples/         # LaTeX templates
├── packages/api/          # API service (Express/Next.js API)
│   └── server/           # Server-side helpers
├── packages/latex/        # LaTeX compilation utilities
│   └── services/         # LaTeX service code
├── infra/                 # Infrastructure and deployment
│   └── scripts/          # Setup and deploy scripts
└── .github/              # Issue templates and PR template
```

## 🔧 Configuration

### Environment Variables

```env
# Ollama configuration
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_TIMEOUT_MS=20000

# API port (optional)
PORT=3001
```

### Customizing Projects

Edit the LaTeX template at `apps/web/examples/user_resume.tex` to add your projects:

```latex
% START PROJECTS
\resumeProject{Your Project Title}{Tech Stack}{Duration}{Location}
\resumeHollowItemListStart
\item {Achievement 1}
\item {Achievement 2}
\resumeHollowItemListEnd
% END PROJECTS
```

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

#### `POST /api/generate-resume`

Generates optimized resume based on job description.

**Request:**

```json
{
  "jobDescription": "Full-stack developer position..."
}
```

**Response:**

```json
{
  "id": "unique-id",
  "pdfUrl": "/api/pdf/unique-id",
  "debug": {
    "selectedProjectTitles": ["Project A", "Project B"],
    "projectScores": [...],
    "keywords": ["react", "node.js"],
    "roleSignals": ["frontend", "react"]
  }
}
```

#### `GET /api/status`

Health checks for Ollama and pdflatex.

## 🔍 Troubleshooting

### Common Issues

#### Ollama Connection Failed

```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
ollama serve
```

#### pdflatex Not Found

```bash
# Ubuntu/Debian
sudo apt-get install texlive-full

# macOS
brew install --cask mactex

# Windows
# Install MiKTeX from https://miktex.org/
```

#### LaTeX Compilation Errors

Check the debug response for specific error messages. Common issues:

- Missing LaTeX packages
- Syntax errors in template
- Special characters not escaped

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

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

If you encounter issues:

1. Check the troubleshooting section above
2. Search existing [GitHub issues](https://github.com/your-repo/AutoATS/issues)
3. Create a new issue with detailed information and debug output

---

**Built with ❤️ for job seekers who want to stand out!**
