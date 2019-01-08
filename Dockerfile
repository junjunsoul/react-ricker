FROM circleci/node:latest-browsers

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm i

COPY ./ ./

CMD ["npm", "run", "build"]
