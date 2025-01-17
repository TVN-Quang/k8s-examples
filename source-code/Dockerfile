# Sử dụng Node.js base image phiên bản nhỏ gọn
FROM node:18-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json trước để tối ưu layer caching
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --only=production

# Sao chép toàn bộ mã nguồn ứng dụng vào container
COPY . .

# Expose cổng HTTP của ứng dụng
EXPOSE 3000

# Lệnh chạy server Node.js
CMD ["node", "app.js"]
