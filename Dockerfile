# auth-service/Dockerfile
FROM node:20-alpine

# Declaring env
ENV NODE_ENV development
ENV MONGO_URI mongodb+srv://ahmadsiddiqp:cIEiu8ExZFm3fatk@cluster0.pzfilcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV JWT_SECRET tahuenak

COPY package*.json ./
RUN npm install

WORKDIR /app

COPY . .

CMD ["node", "index.js"]

EXPOSE 5000


