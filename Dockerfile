FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npm run postinstall && npm run build

EXPOSE 3000

CMD ["sh", "-c", "until npm run db:push; do echo 'Waiting for database...'; sleep 2; done; npm run start"]
