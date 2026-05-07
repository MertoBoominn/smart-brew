# ☕ Smart Brew - Veri Odaklı Kahve Deneyimi ve BI Entegrasyonu

**Smart Brew**, butik bir kahve dükkanının dijital vitrini olmanın ötesinde, gerçek zamanlı bir **veri üretim ve telemetri merkezi** olarak tasarlanmıştır. Bu proje, modern ön yüz mühendisliği ile İş Zekası (Business Intelligence - BI) kavramlarının kesişim noktasını temsil eden yüksek sadakatli bir prototiptir.

---

## 🎯 Proje Vizyonu

Smart Brew'un temel amacı, kullanıcı etkileşimlerini (tıklamalar, görünümler, tercihler) yakalayarak bunları anlamlı ticari içgörülere dönüştürmektir. Minimalist ve premium bir tasarımla sunulan bu platform, her bir kullanıcı hareketini bir veri noktası olarak kabul eder ve bu verileri BI Dashboard üzerinde stratejik kararlara dönüştürür.

---

## 🛠️ Kullanılan Teknolojiler

- **Next.js 15 (App Router):** Performanslı ve SEO dostu sunucu tarafı renderleme.
- **React 19:** En güncel bileşen mimarisi.
- **Tailwind CSS:** Hızlı ve esnek görsel tasarım.
- **Recharts:** Veri görselleştirme ve analitik grafikler.
- **Framer Motion:** Akıcı ve premium kullanıcı deneyimi geçişleri.
- **Lucide React:** Modern ikon seti.
- **Sonner:** Glassmorphism tarzı bildirimler.
- **Canvas Confetti:** Satın alma kutlama efektleri.

---

## 📊 İş Zekası (BI) Mimarisi

Smart Brew, veriyi iki temel kategoride toplar ve işler:

### 1. Yapılandırılmış Veri (Structured Data)
Doğrudan SQL veri tabanlarına kaydedilmeye hazır, kategorik ve sayısal verilerdir.
- **Ürün Etkileşimleri:** Hangi ürünün kaç kez görüntülendiği (`VIEW`), sepete eklendiği (`ADD_TO_CART`) ve satın alındığı (`PURCHASE_COMPLETED`).
- **Müşteri Tercihleri:** Kahve sertlik seçimi (Strong, Smooth, Milky).
- **Zaman Damgaları:** Etkileşimin gerçekleştiği tam an.
- **Satın Alma Verileri:** Sipariş detayları, ürün miktarları, birim fiyatlar ve toplam tutar.

### 2. Yapılandırılmamış Veri (Unstructured Data)
Serbest metin alanlarından gelen, işlenmesi için Doğal Dil İşleme (NLP) gerektiren verilerdir.
- **Özel İstekler:** Kullanıcıların formdaki metin kutusuna yazdığı kişisel notlar. Bu veriler sistem tarafından `nlp_processing_required: true` bayrağı ile işaretlenir.

### 3. Davranışsal Analitik (Behavioral Analytics)
- **Sepet Terk Oranı (Cart Abandonment Rate):** Kullanıcı sepete ürün ekleyip satın alma yapmadan sayfayı terk ettiğinde `CART_ABANDONED` olayı loglanır. `ADD_TO_CART` ve `PURCHASE_COMPLETED` olaylarının oranı üzerinden hesaplanır.

---

## 📂 Klasör Yapısı ve Teknik Detaylar

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── log/
│   │   │       └── route.ts  # Frontend telemetrisini Vercel sunucu loglarına ileten API
│   │   ├── dashboard/      # Analitik katman ve BI Dashboard UI (canlı güncelleme)
│   │   ├── layout.tsx      # CartProvider sarıcı, global overlay bileşenleri
│   │   └── page.tsx        # Veri üretim noktası (Landing Page)
│   ├── components/
│   │   ├── CartDrawer.tsx    # Glassmorphism sepet çekmecesi (miktar kontrolleri)
│   │   ├── CartIcon.tsx      # Animasyonlu sayı rozetli kayan sepet butonu
│   │   ├── CustomerForm.tsx  # Yapılandırılmış/Yapılandırılmamış veri toplama
│   │   ├── HeroSection.tsx   # Premium giriş ekranı
│   │   ├── Navbar.tsx        # Global navigasyon (sepet rozeti)
│   │   ├── ProductList.tsx   # Ürün kataloğu ve etkileşim takibi
│   │   ├── SuccessModal.tsx  # Konfeti efektli satın alma onay modalı
│   │   └── Toaster.tsx       # Glassmorphism bildirim sistemi
│   ├── context/
│   │   └── CartContext.tsx   # Global sepet durum yönetimi
│   ├── data/               # Simüle edilmiş analitik veri setleri
│   └── lib/
│       ├── bi-logger.ts      # BI Telemetri Motoru ve Şema tanımları
│       ├── bi-store.ts       # Reaktif pub/sub mağaza (Sepet ↔ Dashboard)
│       └── utils.ts          # Yardımcı fonksiyonlar
```

### BI Logger (`/lib/bi-logger.ts`)
Bu motor, sistemdeki tüm etkileşimleri yakalar. Gerçek bir senaryoda bu veriler Kafka veya Kinesis gibi bir olay akışına gönderilir. 
**Çift Yönlü Loglama:** Mevcut prototipte veriler hem tarayıcı konsoluna (renkli JSON formatında) basılır, hem de arkaplanda `/api/log` rotasına gönderilerek **Vercel Sunucu Loglarında** (Server Logs) veya yerel terminalinizde görünmesi sağlanır. `PURCHASE_COMPLETED` olayları tam sipariş detaylarıyla loglanır.

### Reaktif BI Mağazası (`/lib/bi-store.ts`)
Alışveriş sepeti ile BI Dashboard arasında gerçek zamanlı köprü görevi gören hafif bir pub/sub sistemi:
- React'in `useSyncExternalStore` kancası ile uyumlu değişmez (immutable) durum güncellemeleri kullanır.
- Her satın almada: Popüler Ürünler satışları, Haftalık Gelir, Son Aktivite ve KPI kartları anlık güncellenir.
- **Sepet Terk Oranı** hesaplaması için `ADD_TO_CART` vs `PURCHASE_COMPLETED` sayılarını takip eder.

### Sepet Sistemi (`/context/CartContext.tsx`)
React Context tabanlı global durum yöneticisi:
- Sepet öğeleri (id, ad, fiyat, görsel, miktar) takip edilir.
- `totalItems` ve `totalPrice` otomatik hesaplanır.
- Yaşam döngüsü olaylarında BI tetikleyicileri: `ADD_TO_CART`, `PURCHASE_COMPLETED`, `CART_ABANDONED`.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/MertoBoominn/smart-brew.git
   cd smart-brew
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   pnpm install  # veya npm install
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   pnpm dev
   ```
Tarayıcınızda `http://localhost:3000` adresine giderek ana sayfayı, `/dashboard` adresinden ise analitik paneli görüntüleyebilirsiniz.

---

## 📖 Kullanım Kılavuzu

### 1. Veri Üretimi (Landing Page)
- Ana sayfadaki ürünlerin üzerine gelerek veya **"Ürün Ekle (+)"** butonuna basarak sisteme telemetri verisi üretin ve ürünü sepete ekleyin.
- **Sepet Kullanımı:** Ekranda sağ altta bulunan kayan sepet ikonuna tıklayarak sepet çekmecesini açın. Miktar ayarlama (+/-), ürün silme ve satın alma işlemlerini gerçekleştirin.
- **Satın Alma:** "COMPLETE PURCHASE" butonuna bastığınızda konfeti efekti ve başarı modalnı görürsünüz. BI telemetrisine `PURCHASE_COMPLETED` olayı loglanır.
- **Veriyi İzleme (Frontend):** Tarayıcıda `F12` (İncele) tuşuna basıp **Console** sekmesine bakın. `[BI DATA INGESTION]` başlığı ile oluşturulan JSON paketlerini göreceksiniz.
- **Veriyi İzleme (Backend/Vercel):** İşlemler gerçekleştiğinde Vercel projenizin "Logs" paneline (veya yerel terminalinize) bakarsanız, `[SERVER LOG]` etiketiyle gelen gerçek zamanlı verileri görebilirsiniz.
- **Müşteri Formu:** Formu doldurup tercihinizi kaydedin. Bu işlem, hem yapılandırılmış hem de NLP'ye hazır veriyi sisteme gönderir.

### 2. Veri Analizi (BI Dashboard)
- **KPI Kartları:** Toplam gelir, sepet terk oranı, müşteri bağlılığı ve yoğun saat gibi kritik metrikleri anlık takip edin. Satın alma yapıldığında KPI'lar canlı olarak güncellenir.
- **Grafik Okuma:**
    - **Popular Products:** En çok ilgi gören ürünleri analiz ederek stok yönetimi yapın. Satın almalarla canlı güncellenir.
    - **Weekly Revenue vs Target:** Belirlenen hedeflere ne kadar yaklaşıldığını izleyin. Bugünün geliri her satışla büyür.
    - **Hourly Demand:** Yoğun saatleri tespit ederek personel planlaması yapın.
- **Recent Activity:** Canlı işlem takibi — ürün miktarlarıyla birlikte (ör: "3 Ethiopean Gold, 1 Oat Latte"). Yeni satın almalar anlık olarak listenin başına eklenir.
- **Sepet Analitiği:** Sepete ekleme sayısı, tamamlanan satın almalar ve hesaplanan Sepet Terk Oranı paneli.
- **Veri Dışa Aktarma:** "Export to CSV" butonu ile tüm ham veriyi Excel'de analiz etmek üzere bilgisayarınıza indirin.

---

## 📈 Stratejik Karar Destek Matrisi

| Toplanan Veri | Analitik Çıktı | İş Kararı (Aksiyon) |
| :--- | :--- | :--- |
| **Görüntüleme/Sepet Oranı** | Ürün İlgi Skoru | **Menü Optimizasyonu:** Düşük performanslı ürünlerin kaldırılması. |
| **Sertlik Tercihleri** | Müşteri Segmentasyonu | **Tedarik Stratejisi:** Tercih edilen kahve çekirdeklerine daha fazla bütçe ayrılması. |
| **Zaman Damgaları** | Operasyonel Yoğunluk | **Vardiya Planlama:** Yoğun saatlerde barista sayısının artırılması. |
| **Gelir vs Hedef** | Finansal Performans | **Pazarlama Stratejisi:** Hedefin altında kalınan günlerde kampanya düzenlenmesi. |
| **Sepet Terk Oranı** | Ödeme Süreci Sürtüşmesi | **UX Optimizasyonu:** Kullanıcıların sepeti terk etmesine neden olan engellerin belirlenmesi. |
| **Satın Alma Olayları** | İşlem Analitiği | **Gelir İlişkilendirme:** Gerçek zamanlı gelir etkisinin takibi ve promosyon etkinliğinin doğrulanması. |

---

*Bu proje, modern web teknolojilerinin ticari birer sensör olarak nasıl kullanılabileceğini göstermek amacıyla geliştirilmiştir. Alışveriş sepeti sistemi, gerçek zamanlı BI dashboard senkronizasyonu ve sepet terk analitiği ile e-ticaret BI entegrasyonunun tam bir prototipini sunar.*
