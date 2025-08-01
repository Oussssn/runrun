# RunIstanbul - İstanbul Koşu Oyunu

RunIstanbul, İstanbul'un mahallelerinde koşarken gerçek coğrafi alanları yakalayarak oyunlaştırılmış bir koşu deneyimi sunan mobil uygulamadır.

## 🎯 Proje Özellikleri

### Ana Özellikler
- **Bölge Yakalama Sistemi**: Grid tabanlı bölge sistemi ile İstanbul'u koşarak fethet
- **İstanbul'a Özel Özellikler**: Tarihi yerler, mahalle sınırları, Bosphorus köprüsü zorlukları
- **Koşu Mekanikleri**: GPS takibi, hız ve mesafe hesaplamaları
- **Sosyal Özellikler**: Yerel koşu topluluğu, mahalle takımları

### Teknik Özellikler
- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express
- **Veritabanı**: PostgreSQL + PostGIS (geospatial data)
- **Real-time**: Socket.io
- **Haritalar**: React Native Maps
- **Authentication**: Firebase Auth
- **State Management**: Redux Toolkit

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18+)
- npm veya yarn
- Expo CLI
- iOS Simulator veya Android Emulator

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone https://github.com/your-username/runistanbul.git
cd runistanbul
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Expo CLI'yi yükleyin (eğer yüklü değilse)**
```bash
npm install -g @expo/cli
```

4. **Uygulamayı başlatın**
```bash
npm start
```

5. **QR kodu tarayın veya emülatörde açın**
- iOS: Expo Go uygulaması ile QR kodu tarayın
- Android: Expo Go uygulaması ile QR kodu tarayın
- Emülatör: Terminal'de 'i' (iOS) veya 'a' (Android) tuşuna basın

## 📱 Kullanım

### İlk Kullanım
1. Uygulamayı açın
2. Hesap oluşturun veya giriş yapın
3. Konum izinlerini verin
4. Koşuya başlayın!

### Koşu Sistemi
- **Başlat**: Koşu ekranında "Koşuyu Başlat" butonuna basın
- **Takip**: GPS ile konumunuz otomatik takip edilir
- **Yakala**: Koşarken bölgeleri yakalayın
- **Durdur**: Koşuyu tamamladığınızda "Koşuyu Durdur" butonuna basın

### Bölge Yakalama
- Her bölge 1km x 1km grid'de
- Koşarken bölgelere yaklaştığınızda otomatik yakalanır
- Tarihi yerler ve özel bölgeler bonus puan verir

## 🏗️ Proje Yapısı

```
src/
├── components/          # UI bileşenleri
│   ├── map/           # Harita bileşenleri
│   ├── game/          # Oyun bileşenleri
│   ├── running/       # Koşu bileşenleri
│   └── ui/            # Genel UI bileşenleri
├── screens/           # Ekranlar
│   ├── auth/          # Kimlik doğrulama ekranları
│   ├── game/          # Oyun ekranları
│   ├── profile/       # Profil ekranları
│   └── leaderboard/   # Sıralama ekranları
├── services/          # Servisler
│   ├── api/           # API servisleri
│   ├── gps/           # GPS servisleri
│   └── game/          # Oyun servisleri
├── utils/             # Yardımcı fonksiyonlar
│   ├── istanbul/      # İstanbul'a özel veriler
│   └── calculations/  # Hesaplama fonksiyonları
├── store/             # Redux store
│   └── slices/        # Redux slices
├── navigation/        # Navigation yapısı
├── context/           # React Context'ler
├── types/             # TypeScript type tanımları
└── assets/            # Resimler, fontlar vb.
```

## 🎮 Oyun Mekanikleri

### Puan Sistemi
- **Normal Bölge**: 100 puan
- **Tarihi Yer**: 200 puan
- **Özel Bölge**: 500 puan
- **Mahalle Bonusu**: +50 puan (Fatih, Beşiktaş vb.)

### Seviye Sistemi
- Her seviye için 1000 deneyim puanı gerekir
- Deneyim puanları koşu mesafesi ve yakalanan bölgelerden gelir
- Seviye atladıkça yeni özellikler açılır

### Bölge Türleri
- **Normal Bölgeler**: Standart yakalama bölgeleri
- **Tarihi Yerler**: Ayasofya, Topkapı Sarayı vb.
- **Özel Bölgeler**: Bosphorus köprüleri, önemli mekanlar
- **Mahalle Bölgeleri**: İstanbul'un 39 ilçesi

## 🗺️ İstanbul Özellikleri

### Mahalleler
- Beşiktaş, Kadıköy, Şişli, Beyoğlu
- Üsküdar, Fatih, Bakırköy, Maltepe
- Ve 31 ilçe daha...

### Tarihi Yerler
- Ayasofya, Topkapı Sarayı
- Sultanahmet Camii, Galata Kulesi
- Dolmabahçe Sarayı
- Bosphorus köprüleri

### Popüler Koşu Rotaları
- Emirgan Korusu (5.2 km)
- Belgrad Ormanı (8.5 km)
- Maçka Parkı (3.1 km)
- Bebek Sahil Yolu (4.8 km)
- Kadıköy Sahil Yolu (6.2 km)

## 🔧 Geliştirme

### Kod Standartları
- TypeScript kullanımı zorunlu
- ESLint ve Prettier konfigürasyonu
- Türkçe ve İngilizce değişken isimleri
- Kapsamlı hata yönetimi

### Test
```bash
npm test
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 📊 Performans

### Optimizasyonlar
- GPS takibi için pil optimizasyonu
- Harita tile'ları için akıllı önbellekleme
- Real-time güncellemeler için optimizasyon
- Dar İstanbul sokaklarında GPS sinyali yönetimi

### Güvenlik
- GPS verisi güvenli iletimi
- Kullanıcı konum gizliliği kontrolleri
- GPS spoofing/cheating önleme
- KVKK (Türk GDPR) uyumluluğu

## 🌍 Çoklu Dil Desteği

- Türkçe (varsayılan)
- İngilizce (gelecek)
- Arapça (gelecek)

## 📱 Platform Desteği

- iOS 13+
- Android 8+
- Web (gelecek)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- Proje Linki: [https://github.com/your-username/runistanbul](https://github.com/your-username/runistanbul)
- E-posta: info@runistanbul.com

## 🙏 Teşekkürler

- İstanbul Büyükşehir Belediyesi
- Türkiye Koşu Federasyonu
- Açık kaynak topluluğu

---

**RunIstanbul** - İstanbul'u koşarak fethet! 🏃‍♂️🗺️ 