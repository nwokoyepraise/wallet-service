FROM node:18

COPY package.json .
RUN npm install
COPY . .
CMD npm run build && npm run db:migrate && npm run start:prod
EXPOSE 5000
