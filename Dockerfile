# Stage 1: Build Vite application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api
ARG VITE_GOOGLE_CLIENT_ID=89640463303-v04joskaeksi6no0o0llghj8dvv6ampo.apps.googleusercontent.com
ARG VITE_CLOUDINARY_CLOUD_NAME=hsvutda8
ARG VITE_RESEND_API_KEY=

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_RESEND_API_KEY=$VITE_RESEND_API_KEY

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
