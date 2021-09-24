# build stage
FROM node:lts-alpine as build-stage

ARG ENVIRONMENT

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "ENVIRONMENT=$ENVIRONMENT" > .env
RUN cat .env
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
