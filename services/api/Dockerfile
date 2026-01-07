FROM node:18
WORKDIR /app
RUN npm install express node-fetch body-parser
COPY index.js ./
EXPOSE 4000
CMD ["node","index.js"]
