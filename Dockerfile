# 빌드 스테이지
FROM node:18-alpine AS build

WORKDIR /app

# 라이브러리 설치에 필요한 파일만 복사 (for 캐싱)
COPY package.json .
COPY package-lock.json .

# 패키지 의존성이 변하지 않으면 캐싱 사용
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build


# 프로덕션 스테이지
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app ./

RUN npm install pm2 -g

EXPOSE 4000

ENTRYPOINT [ "npm" ]

CMD ["run", "start:prod"]
