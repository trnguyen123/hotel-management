# Base image
FROM node:20

# Thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các gói
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng Express thường dùng (ví dụ: 5000)
EXPOSE 5000

# Lệnh chạy app
CMD ["npm", "start"]
