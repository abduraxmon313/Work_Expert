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
assets/js/i18n.js     # RU / EN tarjimalar
assets/img/           # logo, favicon
```

## Ishga tushirishdan oldin

1. **Ariza formasi:** `assets/js/config.js` faylini to'ldiring:
   - `ENDPOINT`: o'zingizning server/proksi manzilingiz (tavsiya etiladi, chunki bot tokeni yashirin qoladi), **yoki**
   - `TG_TOKEN` va `TG_CHAT`: to'g'ridan-to'g'ri Telegram bot orqali yuborish (token ochiq ko'rinib turadi).
2. **Ofislar** (`index.html`):
   - Bosh ofis — Samarqand sh., Yusuf Hamadoniy ko'chasi 28 · +998 55 705-20-20 · ikromsattorov777@gmail.com · xarita: `39.661176, 66.963594` ([Apple Maps](https://maps.apple/p/wTWVK91sjNwEpD))
   - Toshkent filiali — +998 55 055-63-63 · [work-expert.uz](https://work-expert.uz)
   - Ish vaqti hozircha "Du–Sha, 09:00–18:00" — kerak bo'lsa o'zgartiring.

## Tillar (UZ / RU / EN)

- O'zbekcha matn `index.html` ichida turadi (`data-i18n="kalit"` atributi bilan).
- Rus va ingliz tarjimalari `assets/js/i18n.js` da — xuddi shu kalitlar bo'yicha.
- Yangi matn qo'shsangiz: HTML elementga `data-i18n="yangi.kalit"` bering va `i18n.js` dagi `ru` va `en` bo'limlariga tarjimasini yozing.
- Tanlangan til brauzerda eslab qolinadi; havola orqali ham ochish mumkin: `?lang=ru`, `?lang=en`.

## Joylash (GitHub Pages)

Settings → Pages → Branch: `main` / `(root)`. O'z domeningiz bo'lsa (masalan, `samarqand.work-expert.uz`), uni o'sha yerda ulang.

## Lokal ko'rish

```bash
python3 -m http.server 8080
# http://localhost:8080
```
