# build stage
FROM node:lts-alpine@sha256:dc92f36e7cd917816fa2df041d4e9081453366381a00f40398d99e9392e78664 as build-stage

ARG ENVIRONMENT

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "VUE_APP_ENVIRONMENT=$ENVIRONMENT" > .env
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
