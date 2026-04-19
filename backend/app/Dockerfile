FROM node:17-alpine
WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .
CMD npm start