# Construye el frontend React/Vite como archivos estaticos.
# En EC2 no usamos el servidor de desarrollo de Vite: nginx sirve /dist.
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Servidor estatico interno. El proxy principal publica el puerto 80 externo.
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
