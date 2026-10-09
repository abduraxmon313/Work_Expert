# Work Expert — Samarqand filiali

Work Expert Xususiy Bandlik Agentligining Samarqand filiali uchun sayt (litsenziya №721809).
Bosh ofis sayti: [work-expert.uz](https://work-expert.uz).

Oddiy statik sayt (HTML + CSS + JS), build yoki framework kerak emas.

## Tuzilishi

```
index.html            # barcha bo'limlar
assets/css/style.css  # dizayn
assets/js/main.js     # menyu, animatsiyalar, telefon maskasi, ariza formasi
assets/js/config.js   # ariza formasi sozlamalari (Telegram)
assets/img/           # logo, favicon
```

## Ishga tushirishdan oldin

1. **Ariza formasi:** `assets/js/config.js` faylini to'ldiring:
   - `ENDPOINT`: o'zingizning server/proksi manzilingiz (tavsiya etiladi, chunki bot tokeni yashirin qoladi), **yoki**
   - `TG_TOKEN` va `TG_CHAT`: to'g'ridan-to'g'ri Telegram bot orqali yuborish (token ochiq ko'rinib turadi).
2. **Filial ma'lumotlari** (`index.html`): Samarqand sh., Yusuf Hamadoniy ko'chasi 28 · +998 55 705-20-20 · ikromsattorov777@gmail.com · xarita: `39.661176, 66.963594`. Ish vaqti hozircha "Du–Sha, 09:00–18:00" — kerak bo'lsa o'zgartiring.

## Joylash (GitHub Pages)

Settings → Pages → Branch: `main` / `(root)`. O'z domeningiz bo'lsa (masalan, `samarqand.work-expert.uz`), uni o'sha yerda ulang.

## Lokal ko'rish

```bash
python3 -m http.server 8080
# http://localhost:8080
```
