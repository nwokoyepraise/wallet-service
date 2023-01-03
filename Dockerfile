FROM node:18

#WORKDIR /wallet-service
COPY package.json .
RUN npm install
COPY . .
CMD npm run build && npm run db:migrate && npm run start
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=2s --start-period=15s \  
    CMD node docker-health-check.ts