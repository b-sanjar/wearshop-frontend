# WearShop Frontend (Multi-page)

Ko'p sahifali premium frontend arxitekturasi:

- `index.html` (asosiy sahifa)
- `pages/shop/index.html`
- `pages/product/index.html`
- `pages/wishlist/index.html`
- `pages/checkout/index.html`
- `pages/lookbook/index.html`
- `pages/contact/index.html`

Umumiy stil va JS modullar:

- `assets/css/theme.css`
- `assets/css/layout.css`
- `assets/css/pages/*.css`
- `assets/js/common/*.js`
- `assets/js/pages/*.js`

## Ishga tushirish

1. `Frontend` papkani Live Server bilan ishga tushiring.
2. Backend `http://localhost:5000` da ishlasin.

## Deploy

Agar backend domeni o'zgarsa, har bir sahifada common scriptlardan oldin quyidagini qo'shing:

```html
<script>
  window.WEARSHOP_API_URL = "https://your-backend-domain.com/api";
</script>
```
