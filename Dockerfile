# ==============================================================================
# Dockerfile: Multi-Stage Production Build (Node.js Build -> Nginx Serve)
# Task Ledger Pro (Vite + Tailwind CSS v4 Edition)
# BNI ODP IT 2026 - Production Web Architecture
# ==============================================================================

# ------------------------------------------------------------------------------
# TAHAP 1: BUILD ENVIRONMENT (Node.js 22 Alpine)
# Menginstal dependensi dan mengompilasi bundler Vite + Tailwind CSS v4
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Salin manifest dependensi terlebih dahulu untuk memanfaatkan Docker Layer Caching
COPY package*.json ./

# Instal dependensi bersih (clean install)
RUN npm ci

# Salin seluruh kode sumber proyek
COPY . .

# Eksekusi build Vite untuk menghasilkan artefak dist/
RUN npm run build

# ------------------------------------------------------------------------------
# TAHAP 2: PRODUCTION RUNTIME (Nginx 1.27 Alpine)
# Menghasilkan image produksi super ramping tanpa dependensi Node.js (~25MB)
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

LABEL maintainer="BNI ODP IT 2026" \
      description="Production Vite + Tailwind CSS v4 Todo App" \
      version="1.0.0"

# Hapus konfigurasi default Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Salin konfigurasi Nginx SPA kustom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil kompilasi dari Tahap 1 (builder) ke direktori web Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Berikan hak akses kepada user nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Port HTTP standar
EXPOSE 80

# Jalankan server web Nginx
CMD ["nginx", "-g", "daemon off;"]
