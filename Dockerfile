FROM node:7

WORKDIR /schulcloud-server
COPY . .
RUN npm install

CMD ["npm", "run", "startd"]
