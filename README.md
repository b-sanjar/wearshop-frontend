# WearShop Frontend

Zamonaviy kiyim-kechak do'koni uchun `HTML + CSS + Vanilla JS` frontend loyihasi.

## Ishga tushirish

1. `Frontend` papkaga kiring.
2. Fayl server bilan oching (masalan VS Code Live Server).
3. Backend ishlayotgan bo'lishi kerak (`http://localhost:5000`).

## API manzilini o'zgartirish (deploy uchun)

`index.html` ichida `app.js` dan oldin quyidagini qo'shing:

```html
<script>
  window.WEARSHOP_API_URL = "https://your-backend-domain.com/api";
</script>
```

## Funksiyalar

- Mahsulotlarni backenddan olish
- Qidiruv, kategoriya, narx bo'yicha filtr
- Saralash va pagination
- Savatga qo'shish, miqdor o'zgartirish, o'chirish
- Ro'yxatdan o'tish / login (JWT)
- Buyurtma yuborish
- Responsive va zamonaviy UI
