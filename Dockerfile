FROM node:16-alpine3.11
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
ARG NODE_ENV=DEVELOPMENT
RUN if [ "$NODE_ENV" = "DEVELOPMENT" ] ; then CMD ["npm run", "start:dev"] ; fi
RUN if [ "$NODE_ENV" = "STAGING" ] ; then CMD ["npm run", "start:stage"] ; fi
RUN if [ "$NODE_ENV" = "PRODUCTION" ] ; then CMD ["npm run", "start:prod"] ; fi