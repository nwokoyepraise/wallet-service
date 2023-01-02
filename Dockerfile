FROM node:18

#WORKDIR /wallet-service
COPY package.json .
RUN npm install
COPY . .
CMD npm run build && npm run start
EXPOSE 8080