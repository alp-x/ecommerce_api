# Modern E-ticaret API'si

Bu proje, NestJS kullanılarak geliştirilmiş modern bir e-ticaret API'sidir.

## Özellikler

- 🛍️ Ürün yönetimi
- 👥 Kullanıcı yönetimi ve kimlik doğrulama
- 🛒 Sepet ve sipariş yönetimi
- 💳 Ödeme sistemi entegrasyonu
- 📦 Stok yönetimi
- 🔔 Gerçek zamanlı bildirimler
- 📊 Raporlama ve analitik
- 🔒 Gelişmiş güvenlik önlemleri

## Teknolojiler

- NestJS
- MongoDB & Mongoose
- JWT Authentication
- WebSocket
- Stripe Payment
- AWS Services

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda çalıştırın
npm run start:dev

# Production build alın
npm run build

# Production modunda çalıştırın
npm run start:prod
```

## Ortam Değişkenleri

Projeyi çalıştırmadan önce `.env` dosyasını oluşturun ve aşağıdaki değişkenleri ayarlayın:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## API Dokümantasyonu

API dokümantasyonuna `/api/docs` endpoint'inden erişebilirsiniz (Swagger UI).

## Test

```bash
# Unit testleri çalıştırın
npm run test

# E2E testleri çalıştırın
npm run test:e2e

# Test coverage raporu alın
npm run test:cov
``` 