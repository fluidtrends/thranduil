FROM node:14 AS build
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY . /usr/src/app/
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:14.17-alpine
RUN apk add dumb-init
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/
CMD ["dumb-init", "node", "index.js"]
