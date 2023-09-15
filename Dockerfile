FROM node:16.13.2
WORKDIR /app
COPY . .

EXPOSE 3031

RUN npm install
RUN npm install dotenv
RUN npm run build
CMD ["npm", "run", "start:prod"] 
