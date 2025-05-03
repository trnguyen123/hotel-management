# Stage 1: Build ứng dụng React
FROM node:20 AS builder

WORKDIR /app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Stage 2: Phục vụ ứng dụng bằng Nginx
FROM nginx:1.27.5

# Copy các file đã build từ stage builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy cấu hình Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]