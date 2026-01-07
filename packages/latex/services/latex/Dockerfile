FROM node:18-slim

RUN apt-get update && apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended texlive-fonts-extra texlive-lang-all && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
# Install runtime dependencies required by the compile server
RUN apt-get update && apt-get install -y npm && npm init -y && npm install express body-parser && rm -rf /var/lib/apt/lists/*

EXPOSE 3030
CMD ["node", "server.js"]
