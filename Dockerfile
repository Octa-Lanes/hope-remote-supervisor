FROM node:21-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
