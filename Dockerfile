FROM node:carbon

LABEL MAINTAINER = "Anthony GW <anthony.waithaka@andela.com>"

LABEL application="quickgym-api"

WORKDIR /app

# add files
ADD ./dist ./
ADD ./config ./config
ADD ./scripts ./scripts
ADD ./package.json ./package-lock.json ./

# install production dependencies
RUN npm install --production && npm install -g babel-polyfill babel-core babel-cli

ENV PATH="./node_modules:$PATH"
RUN chmod +x ./node_modules*

# set env to production
ENV NODE_ENV=production

EXPOSE 3030

CMD node ./server.js
