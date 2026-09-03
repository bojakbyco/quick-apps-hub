FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY hub ./hub
COPY registry ./registry
COPY apps ./apps
COPY scripts ./scripts
COPY test ./test
RUN npm run check && npm test && npm run build
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://127.0.0.1/health || exit 1
