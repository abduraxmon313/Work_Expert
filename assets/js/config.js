/*
 * Ariza formasi sozlamalari (Telegram bot).
 *
 * DIQQAT: bu fayl ochiq (public) repozitoriyda turadi va brauzerda hamma ko'ra oladi.
 * Bot tokenini shu yerga yozsangiz, uni har kim ko'rishi va suiiste'mol qilishi mumkin.
 * Xavfsizroq yo'l: tokenni serverda (masalan, Cloudflare Worker / Netlify Function)
 * saqlab, forma so'rovini o'sha yerga yuborish — buning uchun ENDPOINT ni to'ldiring.
 *
 *  - ENDPOINT: o'zingizning proksi-server manzilingiz (JSON {name, phone, ...} qabul qiladi)
 *  - yoki TG_TOKEN + TG_CHAT: to'g'ridan-to'g'ri Telegram Bot API orqali yuborish
 */
window.WE_CONFIG = {
  BRANCH: "Samarqand",
  ENDPOINT: "",
  TG_TOKEN: "",   // masalan: "1234567890:AA...."
  TG_CHAT: "",    // masalan: "-100xxxxxxxxxx"
  PHONE: "+998550556363"
};
