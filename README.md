# AI Destekli Tarif Oluşturucu

Bu uygulama, yapay zeka destekli bir tarif oluşturma aracıdır. Kullanıcıların ellerindeki malzemelere ve tercihlerine göre özelleştirilmiş tarifler oluşturur.

## Özellikler

- 🧠 Yapay zeka destekli tarif oluşturma
- 🌙 Dark mode arayüz
- 📱 Responsive tasarım
- ✨ Modern ve kullanıcı dostu UI
- 🔄 Gerçek zamanlı geri bildirim
- 📝 Markdown formatında detaylı tarifler

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenRouter AI API
- React Markdown

## Kurulum

1. Repoyu klonlayın:
```bash
git clone [repo-url]
cd recipe-generator
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri ayarlayın:
```bash
cp .env.example .env
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Yapılandırma

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

- `OPENROUTER_API_KEY`: OpenRouter API anahtarınız
- `AI_MODEL`: Kullanmak istediğiniz AI modeli
- `SYSTEM_PROMPT`: Tarif oluşturma promptu

## Production Build

Production build oluşturmak için:

```bash
npm run build
npm start
```

## Deployment

Bu uygulama Vercel, Netlify veya benzeri platformlarda deploy edilebilir. Deployment sırasında environment variables'ları ayarlamayı unutmayın.

## Lisans

MIT

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
