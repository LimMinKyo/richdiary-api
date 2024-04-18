# build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN npm ci --legacy-peer-deps
RUN npm run build


# run stage
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app ./

RUN npm install pm2 -g

EXPOSE 4000

ENTRYPOINT [ "npm" ]

CMD ["run", "start:prod"]
