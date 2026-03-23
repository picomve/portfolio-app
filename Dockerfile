# 1. Aşama: Bağımlılıkları yükle
FROM node:22.15.0-alpine AS deps
# Alpine üzerinde bazı paketlerin derlenmesi için libc6-compat gerekebilir
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Aşama: Uygulamayı derle (Build)
FROM node:22.15.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Aşama: Çalışma zamanı (Runner)
FROM node:22.15.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Güvenlik için yetkisiz kullanıcı oluşturma
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Build aşamasından sadece gerekli dosyaları alıyoruz
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js varsayılan portu 3000'dir
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]