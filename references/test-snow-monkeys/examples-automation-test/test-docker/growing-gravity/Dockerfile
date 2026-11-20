FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4321"]
