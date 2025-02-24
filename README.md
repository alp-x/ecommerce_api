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
- 🏪 Hepsiburada Marketplace Entegrasyonu

## Teknolojiler

- NestJS
- MongoDB & Mongoose
- TypeScript
- Jest (Test)
- Stripe API
- Swagger
- Helmet (Güvenlik)
- Hepsiburada API

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
- `HEPSIBURADA_API_URL`
- `HEPSIBURADA_MERCHANT_ID`
- `HEPSIBURADA_API_KEY`
- `HEPSIBURADA_API_SECRET`

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

### Auth
- Kimlik doğrulama ve yetkilendirme

### Users
- Kullanıcı yönetimi

### Products
- Ürün yönetimi

### Cart
- Alışveriş sepeti işlemleri

### Orders
- Sipariş yönetimi

### Payment
- Ödeme işlemleri
- Stripe entegrasyonu

### Notifications
- Bildirim sistemi
- WebSocket desteği

### Marketplace
#### Hepsiburada
- Ürün senkronizasyonu
- Stok yönetimi
- Fiyat yönetimi
- Sipariş takibi
- Webhook desteği

## Hepsiburada Entegrasyonu

### Özellikler
- Ürün bilgilerini Hepsiburada'ya aktarma
- Otomatik stok senkronizasyonu
- Merkezi fiyat yönetimi
- Sipariş takibi ve durumu güncelleme
- Gerçek zamanlı bildirimler

### API Endpoints

#### Ürün Yönetimi
```
POST /marketplace/hepsiburada/products/:productId/sync
POST /marketplace/hepsiburada/products/:productId/stock
POST /marketplace/hepsiburada/products/:productId/price
```

#### Sipariş Yönetimi
```
GET /marketplace/hepsiburada/orders
POST /marketplace/hepsiburada/orders/:orderId/status
```

### Örnek Kullanım

1. Ürün Senkronizasyonu:
```typescript
// Ürün bilgilerini Hepsiburada'ya gönder
POST /marketplace/hepsiburada/products/123/sync
{
  "name": "Örnek Ürün",
  "price": 199.99,
  "stock": 100,
  "description": "Ürün açıklaması"
}
```

2. Stok Güncelleme:
```typescript
// Stok miktarını güncelle
POST /marketplace/hepsiburada/products/123/stock
{
  "stock": 75
}
```

3. Fiyat Güncelleme:
```typescript
// Fiyat güncelleme
POST /marketplace/hepsiburada/products/123/price
{
  "price": 249.99
}
```

4. Siparişleri Listeleme:
```typescript
// Belirli tarih aralığındaki siparişleri getir
GET /marketplace/hepsiburada/orders?startDate=2024-01-01&endDate=2024-01-31
```

5. Sipariş Durumu Güncelleme:
```typescript
// Sipariş durumunu güncelle
POST /marketplace/hepsiburada/orders/456/status
{
  "status": "shipped"
}
```

## Lisans

MIT 