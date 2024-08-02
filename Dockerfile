FROM node:21.4.0-alpine3.19

WORKDIR /app

COPY ./src ./src
COPY .env .
COPY index.html .
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
COPY yarn.lock .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "preview"]