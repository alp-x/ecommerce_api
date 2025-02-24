# E-Ticaret API

Modern bir e-ticaret platformu için NestJS tabanlı REST API.

## Özellikler

- 🔐 JWT tabanlı kimlik doğrulama ve yetkilendirme
- 💳 Stripe entegrasyonu ile güvenli ödeme işlemleri
- 📦 Ürün yönetimi ve stok takibi
- 🛒 Alışveriş sepeti işlemleri
- 📝 Sipariş yönetimi
- 👥 Kullanıcı yönetimi ve rol bazlı yetkilendirme
- 📨 Bildirim sistemi
- 📚 Swagger API dokümantasyonu

## Teknolojiler

- NestJS
- MongoDB & Mongoose
- TypeScript
- Jest (Test)
- Stripe API
- Swagger
- Helmet (Güvenlik)

## Kurulum

1. Gereksinimleri yükleyin:
```bash
npm install
```

2. Çevre değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

Aşağıdaki değişkenleri `.env` dosyasında yapılandırın:
- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

3. Uygulamayı başlatın:
```bash
# Geliştirme
npm run start:dev

# Prodüksiyon
npm run start:prod
```

## API Dokümantasyonu

Swagger dokümantasyonuna `/api/docs` endpoint'inden erişebilirsiniz.

## Test

```bash
# Unit testleri çalıştır
npm test

# E2E testleri çalıştır
npm run test:e2e

# Test coverage raporu
npm run test:cov
```

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Helmet ile güvenlik başlıkları
- CORS koruması
- Input validasyonu
- Rate limiting
- Rol bazlı yetkilendirme

## Modüller

- Auth: Kimlik doğrulama ve yetkilendirme
- Users: Kullanıcı yönetimi
- Products: Ürün yönetimi
- Cart: Alışveriş sepeti işlemleri
- Orders: Sipariş yönetimi
- Payment: Ödeme işlemleri
- Notifications: Bildirim sistemi

## Lisans

MIT 