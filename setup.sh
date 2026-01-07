#!/bin/bash

# AutoATS Setup Script
echo "🚀 Setting up AutoATS - AI-Powered Resume Builder"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Set up environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please edit .env if needed."
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "🤖 Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    echo "✅ Ollama is already installed"
fi

# Pull LLaMA 3 model
echo "🧠 Pulling LLaMA 3 model..."
ollama pull llama3

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To run the application:"
echo "1. Start Ollama service: ollama serve"
echo "2. Start web app: npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
