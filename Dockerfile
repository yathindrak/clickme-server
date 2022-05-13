## STAGE 01
FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./
COPY tsconfig.json ./
COPY . .

RUN yarn
RUN yarn build

## STAGE 02
FROM node:16
WORKDIR /app
COPY package.json ./

RUN yarn --production --frozen-lockfile

COPY --from=0 /app/dist .
RUN npm install pm2 -g
EXPOSE 8080

CMD ["pm2-runtime","index.js"]