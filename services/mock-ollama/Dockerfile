FROM node:18
WORKDIR /app

# Minimal image: install runtime deps
RUN npm install express body-parser

COPY index.js ./
EXPOSE 11434
CMD ["node", "index.js"]
