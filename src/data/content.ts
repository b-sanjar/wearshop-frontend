import type { JournalPost, LookbookStory, StoreBranch } from "./types";
import { PRODUCTS } from "./products";

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const pick = (cat: string, n: number, offset = 0) =>
  PRODUCTS.filter((p) => p.category === cat)
    .slice(offset, offset + n)
    .map((p) => p.id);

export const LOOKBOOKS: LookbookStory[] = [
  {
    id: "lb-1",
    slug: "quyosh-botishi",
    title: "Quyosh botishi",
    season: "Bahor / Yoz 2026",
    excerpt:
      "Terrakota, qum va kuygan sarg'ish ranglar. Cho'l ufqidan ilhomlangan yengil siluetlar va tabiiy matolar to'plami.",
    cover: u("photo-1469334031218-e382a71b716b", 1800),
    images: [
      u("photo-1469334031218-e382a71b716b"),
      u("photo-1515372039744-b8f02a3ae446"),
      u("photo-1487412947147-5cebf100ffc2"),
      u("photo-1502716119720-b23a93e5fe1b"),
      u("photo-1496747611176-843222e1e57c"),
      u("photo-1483985988355-763728e1935b"),
    ],
    body: [
      "Bu kolleksiya kunning eng oxirgi yorug'ligidan tug'ildi — quyosh ufqqa tegib turgan, hamma narsa oltin rangga bo'yalgan o'sha yigirma daqiqadan.",
      "Zig'ir, yuvilgan paxta va yengil ipak asosiy matolar bo'ldi. Har bir buyum tanaga tegib turmaydi, balki uning atrofida erkin harakatlanadi.",
      "Palitra qasddan cheklangan: kuygan terrakota, issiq qum, oqargan suyak va chuqur zaytun. To'rt rang — cheksiz kombinatsiya.",
    ],
    productIds: [...pick("ayollar", 3), ...pick("unisex", 2)],
  },
  {
    id: "lb-2",
    slug: "shahar-arxitekturasi",
    title: "Shahar arxitekturasi",
    season: "Kuz / Qish 2026",
    excerpt:
      "Qattiq chiziqlar, strukturali yelkalar va monoxrom qatlamlar. Beton va shishadan ilhomlangan shahar formasi.",
    cover: u("photo-1520975954732-35dd22299614", 1800),
    images: [
      u("photo-1520975954732-35dd22299614"),
      u("photo-1507003211169-0a1dd7228f2d"),
      u("photo-1490578474895-699cd4e2cf59"),
      u("photo-1519085360753-af0119f7cbe7"),
      u("photo-1550246140-29f40b909e5a"),
      u("photo-1492447166138-50c3889fccb1"),
    ],
    body: [
      "Shahar — bu geometriya. Biz uni matoga ko'chirdik: aniq yelka chizig'i, tik tushgan palto, keskin burchakli cho'ntaklar.",
      "Og'ir jun va kashmir aralashmalari qish uchun, texnik nylon esa yomg'irli kunlar uchun. Funksiya hech qachon shakl hisobiga qurbon qilinmaydi.",
      "Grafit, tungi ko'k va qora — asosiy uchlik. Ular bir-biriga qatlam-qatlam kiyiladi.",
    ],
    productIds: [...pick("erkaklar", 4), ...pick("aksessuar", 1)],
  },
  {
    id: "lb-3",
    slug: "atelier-kunlari",
    title: "Atelier kunlari",
    season: "Kapsula kolleksiya",
    excerpt:
      "Ustaxona ichidagi hayot: qo'lda tikish, o'lchov olish va materialni tanlash jarayoni fotoda.",
    cover: u("photo-1556821840-3a9fbc2aeb4e", 1800),
    images: [
      u("photo-1556821840-3a9fbc2aeb4e"),
      u("photo-1521572163474-6864f9cf17ab"),
      u("photo-1618354691373-d851c5c3a990"),
      u("photo-1503341504253-dff4815485f1"),
      u("photo-1554568218-0f1715e72254"),
      u("photo-1596755094514-f87e34085b2c"),
    ],
    body: [
      "Har bir kolleksiya qog'ozdagi chizmadan boshlanadi va ustaxonada, tikuv mashinasi ortida yakunlanadi.",
      "Biz kichik partiyalarda ishlaymiz — bir modeldan 80 dan 200 tagacha. Bu bizga har bir tikuvni tekshirish imkonini beradi.",
      "Ortiqcha ishlab chiqarish yo'q. Sotilmagan mahsulot yo'q. Chiqindi minimal.",
    ],
    productIds: [...pick("unisex", 3), ...pick("erkaklar", 2, 4)],
  },
  {
    id: "lb-4",
    slug: "kechki-yorugllik",
    title: "Kechki yorug'lik",
    season: "Soirée 2026",
    excerpt: "Ipak, satin va oqadigan siluetlar — tungi marosimlar uchun yaratilgan kapsula.",
    cover: u("photo-1539109136881-3be0616acf4b", 1800),
    images: [
      u("photo-1539109136881-3be0616acf4b"),
      u("photo-1581044777550-4cfa60707c03"),
      u("photo-1495385794356-15371f348c31"),
      u("photo-1524504388940-b1c1722653e1"),
      u("photo-1509631179647-0177331693ae"),
      u("photo-1485968579580-b6d095142e6e"),
    ],
    body: [
      "Soirée — bu kechqurun boshlanadigan kolleksiya. Yorug'lik pasayganda mato o'zini boshqacha tutadi.",
      "22 momme tut ipagi, sandwashed satin va viskoza krep. Barchasi tanadan oqib tushadi.",
      "Bezak minimal — barcha e'tibor kesim va harakatga qaratilgan.",
    ],
    productIds: [...pick("ayollar", 5)],
  },
];

export const JOURNAL: JournalPost[] = [
  {
    id: "j-1",
    slug: "kapsula-garderob-qollanma",
    title: "Kapsula garderob: 30 buyumdan cheksiz kombinatsiya",
    category: "Uslub",
    excerpt:
      "Kamroq buyum, ko'proq imkoniyat. Har kuni nima kiyish haqida o'ylashni to'xtatadigan tizim qanday quriladi.",
    cover: u("photo-1489987707025-afc232f7ea0f", 1600),
    date: "2026-06-18",
    readMinutes: 7,
    author: "Nodira Ahmedova",
    body: [
      { type: "p", content: "Kapsula garderob g'oyasi 1970-yillarda paydo bo'lgan, lekin bugungi kunda u hech qachon bo'lmaganchalik dolzarb. Sabab oddiy: bizda tanlov juda ko'p, vaqt esa juda kam." },
      { type: "h", content: "Nimadan boshlanadi" },
      { type: "p", content: "Birinchi qadam — inventarizatsiya. Garderobingizdagi hamma narsani chiqarib, uchta guruhga ajrating: oxirgi uch oyda kiyganlar, kiyishni istaganlar va hech qachon kiymaganlar. Uchinchi guruh — bu sizning xatolaringiz tarixi." },
      { type: "quote", content: "Yaxshi garderob — bu to'ldirilgan shkaf emas, balki har kuni ishlaydigan tizim." },
      { type: "p", content: "Ikkinchi qadam — asosiy palitrani tanlash. Ikkita neytral rang (masalan, qora va qum) va bitta urg'u rangi (terrakota yoki zaytun) yetarli. Bu uchta rang o'zaro yuz foiz mos keladi." },
      { type: "img", content: u("photo-1445205170230-053b83016050", 1600) },
      { type: "h", content: "30 buyum formulasi" },
      { type: "p", content: "Amaliyotda bu shunday ko'rinadi: 6 ta yuqori qism, 4 ta shim yoki yubka, 3 ta ustki kiyim, 2 ta trikotaj, 3 juft poyabzal, 4 ta aksessuar va mavsumga qarab qolganlari. Matematik jihatdan bu 500 dan ortiq kombinatsiya beradi." },
      { type: "p", content: "Eng muhimi — har bir yangi buyum kamida uchta mavjud buyum bilan mos kelishi kerak. Bu qoida impulsiv xaridlarning 90 foizini to'xtatadi." },
    ],
  },
  {
    id: "j-2",
    slug: "jun-turlari-farqi",
    title: "Merino, kashmir, alpaka: jun turlari orasidagi haqiqiy farq",
    category: "Material",
    excerpt: "Yorliqdagi so'zlar nimani anglatadi va nima uchun bir sviter uch baravar qimmat bo'lishi mumkin.",
    cover: u("photo-1520903920243-00d872a2d1c9", 1600),
    date: "2026-05-30",
    readMinutes: 6,
    author: "Sardor Qodirov",
    body: [
      { type: "p", content: "Jun — bu bitta material emas, balki o'nlab turli tolalar oilasi. Ular orasidagi farq narxda emas, balki tolaning qalinligida (mikron bilan o'lchanadi)." },
      { type: "h", content: "Mikron — asosiy o'lchov" },
      { type: "p", content: "Oddiy qo'y juni 25-30 mikron. U issiq, lekin teriga qichishtiradi. Merino 15-19 mikron — yumshoq va nafas oladi. Kashmir 14-16 mikron, lekin ancha yengilroq va issiqroq." },
      { type: "quote", content: "Bir echkidan yiliga atigi 150 gramm kashmir olinadi. Bitta sviter uchun to'rt echki kerak." },
      { type: "p", content: "Alpaka esa alohida holat: u kashmirdan issiqroq, lanolin (jun yog'i) tutmaydi, shuning uchun allergiya keltirmaydi." },
      { type: "img", content: u("photo-1601924994987-69e26d50dc26", 1600) },
      { type: "h", content: "Qanday tanlash kerak" },
      { type: "p", content: "Kundalik kiyim uchun merino eng amaliy tanlov — u yuviladi, shaklini saqlaydi va hidni ushlamaydi. Kashmirni esa maxsus holatlar uchun saqlang va faqat qo'lda yuving." },
    ],
  },
  {
    id: "j-3",
    slug: "olcham-jadvali-nima-uchun-ishlamaydi",
    title: "Nima uchun o'lcham jadvallari ishlamaydi",
    category: "Qo'llanma",
    excerpt: "Bir brendda M, boshqasida L. Vanity sizing fenomeni va o'z o'lchovingizni bilishning ahamiyati.",
    cover: u("photo-1441984904996-e0b6ba687e04", 1600),
    date: "2026-05-12",
    readMinutes: 5,
    author: "Kamila Yusupova",
    body: [
      { type: "p", content: "Agar sizda uch xil brenddan uch xil o'lchamdagi shim bo'lsa — bu sizning aybingiz emas. Bu sanoat muammosi." },
      { type: "h", content: "Vanity sizing" },
      { type: "p", content: "1950-yillardan beri brendlar o'lchamlarni sekin-asta kattalashtirib bormoqda. Bugungi 'M' 1970-yildagi 'L' ga teng. Sabab psixologik: kichikroq raqam yozilgan yorliq yaxshiroq sotiladi." },
      { type: "quote", content: "Yorliqdagi harfga emas, santimetrga ishoning." },
      { type: "p", content: "Yechim — o'z o'lchovlaringizni bilish: ko'krak, bel, son va yelka kengligi. Bu to'rt raqam bilan har qanday jadvalda to'g'ri o'lchamni topasiz." },
      { type: "p", content: "Bizning har bir mahsulot sahifasida buyumning o'zining aniq o'lchamlari (yotqizilgan holatda) berilgan — bu jadvaldan ancha ishonchli." },
    ],
  },
  {
    id: "j-4",
    slug: "kiyimni-uzoq-saqlash",
    title: "Kiyimingiz umrini ikki barobar uzaytiruvchi 8 odat",
    category: "Parvarish",
    excerpt: "Yuvish harorati, ilgich tanlash va saqlash usullari — kichik o'zgarishlar, katta natija.",
    cover: u("photo-1489274495757-95c7c837b101", 1600),
    date: "2026-04-22",
    readMinutes: 8,
    author: "Nodira Ahmedova",
    body: [
      { type: "p", content: "Kiyim eskirmaydi — u noto'g'ri parvarishdan buziladi. Quyidagi sakkiz odat buyumlaringiz umrini jiddiy uzaytiradi." },
      { type: "h", content: "1. Kamroq yuving" },
      { type: "p", content: "Jun va denim har kiyganda yuvishni talab qilmaydi. Ko'pincha shamollatish yetarli. Har bir yuvish tolani biroz yemiradi." },
      { type: "h", content: "2. Sovuq suv" },
      { type: "p", content: "30°C aksariyat matolar uchun yetarli. Issiq suv ranglarni yo'qotadi va tolani cho'zadi." },
      { type: "h", content: "3. To'g'ri ilgich" },
      { type: "p", content: "Ingichka sim ilgichlar yelkani buzadi. Palto va kostyum uchun keng yelkali yog'och ilgich shart. Trikotajni esa umuman osmang — taxlab qo'ying." },
      { type: "img", content: u("photo-1558769132-cb1aea458c5e", 1600) },
      { type: "h", content: "4-8. Qolganlari" },
      { type: "p", content: "Ichini ag'darib yuving; fermuar va tugmalarni yoping; dazmolni past haroratda va mato orqali ishlating; mavsumdan tashqari kiyimni nafas oladigan matoli qopda saqlang; teri buyumlarni har olti oyda maxsus krem bilan ishlov bering." },
    ],
  },
  {
    id: "j-5",
    slug: "barqarorlik-hisoboti-2026",
    title: "Barqarorlik hisoboti 2026: raqamlar bilan",
    category: "Brend",
    excerpt: "Ishlab chiqarish zanjiri, materiallar kelib chiqishi va keyingi yil uchun majburiyatlarimiz.",
    cover: u("photo-1523381210434-271e8be1f52b", 1600),
    date: "2026-03-08",
    readMinutes: 9,
    author: "WEARSHOP jamoasi",
    body: [
      { type: "p", content: "Shaffoflik — bu marketing shiori emas, balki hisobot. Quyida 2025-yil bo'yicha to'liq ma'lumot." },
      { type: "h", content: "Materiallar" },
      { type: "p", content: "Kolleksiyalarimizning 68 foizi sertifikatlangan organik yoki qayta ishlangan tolalardan. Maqsad — 2027-yilga qadar 90 foiz." },
      { type: "quote", content: "Eng barqaror kiyim — bu siz allaqachon ega bo'lgan kiyim. Ikkinchi o'rinda — uzoq xizmat qiladigani." },
      { type: "h", content: "Ishlab chiqarish" },
      { type: "p", content: "To'rtta ustaxona bilan ishlaymiz: ikkitasi Denovda, bittasi Termizda, bittasi Toshkentda. Barchasi to'g'ridan-to'g'ri shartnoma asosida, vositachisiz." },
      { type: "h", content: "Qadoqlash" },
      { type: "p", content: "2025-yil sentabridan boshlab barcha plastik qadoqlash qayta ishlangan qog'ozga almashtirildi. Yiliga taxminan 2.4 tonna plastik tejaladi." },
    ],
  },
  {
    id: "j-6",
    slug: "kuz-qish-trendlari",
    title: "Kuz/qish 2026: qatlamlash san'ati",
    category: "Uslub",
    excerpt: "Uchta qatlam qoidasi, proporsiya balansi va sovuq havoda ham nafis ko'rinish sirlari.",
    cover: u("photo-1483118714900-540cf339fd46", 1600),
    date: "2026-02-14",
    readMinutes: 6,
    author: "Kamila Yusupova",
    body: [
      { type: "p", content: "Qatlamlash — bu shunchaki issiq kiyinish emas, balki kompozitsiya yaratish." },
      { type: "h", content: "Uchta qatlam qoidasi" },
      { type: "p", content: "Baza (teriga tegadigan, ingichka), o'rta qatlam (issiqlik ushlaydigan — trikotaj yoki jaket) va tashqi qatlam (shamol va namlikdan himoya)." },
      { type: "p", content: "Har bir qatlam pastdagisidan biroz uzunroq yoki qisqaroq bo'lishi kerak — bu chuqurlik hosil qiladi." },
      { type: "img", content: u("photo-1517445312882-bc9910d016b7", 1600) },
      { type: "h", content: "Proporsiya" },
      { type: "p", content: "Agar tepa keng bo'lsa, past tor bo'lsin va aksincha. Ikkala tomon ham keng bo'lsa, silueti yo'qoladi." },
      { type: "p", content: "Rang bo'yicha: qatlamlar bir palitrada, lekin turli to'yinganlikda bo'lgani eng ishonchli yechim." },
    ],
  },
];

/** The Denov branch is the head office — it leads the list everywhere. */
export const STORES: StoreBranch[] = [
  {
    id: "st-1",
    city: "Denov",
    name: "WEARSHOP Flagship — Denov",
    address: "Surxondaryo viloyati, Denov shahri, Istiqlol ko'chasi 42",
    phone: "+998 76 412 10 10",
    hours: "Har kuni 09:00 — 21:00",
    image: u("photo-1441986300917-64674bd600d8", 1400),
    flagship: true,
  },
  {
    id: "st-2",
    city: "Termiz",
    name: "WEARSHOP Termiz",
    address: "Surxondaryo viloyati, Termiz shahri, Al-Hakim at-Termiziy ko'chasi 18",
    phone: "+998 76 227 30 30",
    hours: "Har kuni 10:00 — 21:00",
    image: u("photo-1567401893414-76b7b1e5a7a5", 1400),
    flagship: false,
  },
  {
    id: "st-3",
    city: "Toshkent",
    name: "WEARSHOP Toshkent — Amir Temur",
    address: "Amir Temur shoh ko'chasi 107B, Yunusobod tumani",
    phone: "+998 71 200 10 10",
    hours: "Har kuni 10:00 — 22:00",
    image: u("photo-1604014237800-1c9102c219da", 1400),
    flagship: false,
  },
  {
    id: "st-4",
    city: "Samarqand",
    name: "WEARSHOP Samarqand",
    address: "Registon ko'chasi 24",
    phone: "+998 66 233 40 40",
    hours: "Har kuni 10:00 — 21:00",
    image: u("photo-1604719312566-8912e9227c6a", 1400),
    flagship: false,
  },
  {
    id: "st-5",
    city: "Buxoro",
    name: "WEARSHOP Buxoro",
    address: "Mustaqillik ko'chasi 8",
    phone: "+998 65 224 55 55",
    hours: "Dush—Shan 10:00 — 20:00",
    image: u("photo-1555529669-e69e7aa0ba9a", 1400),
    flagship: false,
  },
  {
    id: "st-6",
    city: "Farg'ona",
    name: "WEARSHOP Farg'ona",
    address: "Al-Farg'oniy ko'chasi 41",
    phone: "+998 73 244 30 30",
    hours: "Dush—Shan 10:00 — 20:00",
    image: u("photo-1582037928769-181f2644ecb7", 1400),
    flagship: false,
  },
  {
    id: "st-7",
    city: "Nukus",
    name: "WEARSHOP Nukus",
    address: "Do'stlik guzari 15",
    phone: "+998 61 222 77 77",
    hours: "Dush—Shan 10:00 — 20:00",
    image: u("photo-1604014237800-1c9102c219da", 1400),
    flagship: false,
  },
];

export const FAQ_GROUPS = [
  {
    group: "Buyurtma va to'lov",
    items: [
      {
        q: "Qanday to'lov usullari qabul qilinadi?",
        a: "UzCard va Humo plastik kartalari, Visa/Mastercard, Payme va Click orqali onlayn to'lov, shuningdek yetkazib berishda naqd pul yoki terminal orqali to'lash mumkin.",
      },
      {
        q: "Buyurtmani bekor qilsam bo'ladimi?",
        a: "Ha. Buyurtma 'Jo'natildi' statusiga o'tmagunicha shaxsiy kabinetdan yoki qo'llab-quvvatlash xizmatiga murojaat qilib bepul bekor qilishingiz mumkin.",
      },
      {
        q: "Promo-kod qanday ishlatiladi?",
        a: "Savat sahifasida yoki to'lov bosqichida 'Promo-kod' maydoniga kodni kiriting va tasdiqlang. Chegirma darhol yakuniy summada aks etadi. Bir buyurtmaga bitta kod qo'llaniladi.",
      },
    ],
  },
  {
    group: "Yetkazib berish",
    items: [
      {
        q: "Yetkazish qancha vaqt oladi?",
        a: "Surxondaryo viloyati bo'ylab 1—2 ish kuni, boshqa viloyatlarga 2—4 ish kuni. Buyurtma holatini shaxsiy kabinetdan kuzatib borishingiz mumkin.",
      },
      {
        q: "Yetkazish narxi qancha?",
        a: "Standart yetkazish — 30 000 so'm. 500 000 so'mdan yuqori buyurtmalar uchun butun O'zbekiston bo'ylab bepul.",
      },
      {
        q: "Do'kondan olib ketsam bo'ladimi?",
        a: "Ha, olti filialimizning istalganidan bepul olib ketish mumkin. To'lov bosqichida 'Do'kondan olish' variantini tanlang.",
      },
    ],
  },
  {
    group: "Qaytarish va almashtirish",
    items: [
      {
        q: "Qaytarish muddati qancha?",
        a: "Mahsulotni olganingizdan keyin 14 kun ichida sababini tushuntirmasdan qaytarishingiz mumkin. Buyum kiyilmagan, yorliqlari joyida va original qadoqda bo'lishi kerak.",
      },
      {
        q: "O'lcham to'g'ri kelmasa nima qilaman?",
        a: "Bepul almashtirish xizmatidan foydalaning. Kabinetdagi buyurtmadan 'Almashtirish' tugmasini bosing — kuryer eski buyumni olib, yangisini keltiradi.",
      },
      {
        q: "Pul qachon qaytariladi?",
        a: "Qaytarilgan buyum omborga yetib borgach 3—5 bank kuni ichida to'lov amalga oshirilgan usulga qaytariladi.",
      },
    ],
  },
  {
    group: "Mahsulot va parvarish",
    items: [
      {
        q: "Mahsulotlar qayerda ishlab chiqariladi?",
        a: "Kolleksiyalarimiz Denov va Termizdagi to'rtta hamkor ustaxonada, kichik partiyalarda tikiladi. Matolar Italiya, Turkiya va O'zbekistondan yetkazib beriladi.",
      },
      {
        q: "Kafolat bormi?",
        a: "Barcha buyumlarga tikuv nuqsonlari bo'yicha 6 oylik kafolat beriladi. Nuqson aniqlansa — bepul ta'mirlash yoki almashtirish.",
      },
      {
        q: "Parvarish bo'yicha maslahat qayerda?",
        a: "Har bir mahsulot sahifasida 'Parvarish' bo'limi bor. Batafsil qo'llanmalarni Jurnal bo'limidan ham topasiz.",
      },
    ],
  },
];

export const SIZE_TABLES = {
  erkaklar: {
    cols: ["O'lcham", "Ko'krak (sm)", "Bel (sm)", "Yelka (sm)", "Yeng (sm)"],
    rows: [
      ["XS", "88—92", "74—78", "42", "62"],
      ["S", "92—96", "78—82", "44", "63"],
      ["M", "96—102", "82—88", "46", "64"],
      ["L", "102—108", "88—94", "48", "65"],
      ["XL", "108—114", "94—100", "50", "66"],
      ["XXL", "114—120", "100—108", "52", "67"],
    ],
  },
  ayollar: {
    cols: ["O'lcham", "Ko'krak (sm)", "Bel (sm)", "Son (sm)", "Uzunlik (sm)"],
    rows: [
      ["XS", "80—84", "60—64", "86—90", "58"],
      ["S", "84—88", "64—68", "90—94", "59"],
      ["M", "88—92", "68—72", "94—98", "60"],
      ["L", "92—98", "72—78", "98—104", "61"],
      ["XL", "98—104", "78—84", "104—110", "62"],
    ],
  },
};

export const VALUES = [
  {
    n: "01",
    title: "Kichik partiya",
    text: "Bir modeldan 80—200 dona. Ortiqcha ishlab chiqarish yo'q, chegirmali omborlar yo'q.",
  },
  {
    n: "02",
    title: "Shaffof zanjir",
    text: "Har bir ustaxona nomi va manzili ochiq. To'g'ridan-to'g'ri shartnoma, vositachisiz.",
  },
  {
    n: "03",
    title: "Material birinchi",
    text: "68% organik yoki qayta ishlangan tola. 2027-yilga qadar 90% ga yetkazish maqsadi.",
  },
  {
    n: "04",
    title: "Ta'mirlash xizmati",
    text: "Sotib olgan buyumingizni bizga qaytaring — biz uni tuzatamiz. Birinchi yil bepul.",
  },
];

export const TIMELINE = [
  { year: "2018", title: "Ustaxona", text: "Denovda uch kishilik jamoa va bitta tikuv mashinasi bilan boshlandi." },
  { year: "2020", title: "Birinchi do'kon", text: "Denov markazida 120 m² maydonli flagship do'kon ochildi." },
  { year: "2022", title: "Onlayn platforma", text: "Butun mamlakat bo'ylab yetkazib berish va raqamli katalog ishga tushdi." },
  { year: "2024", title: "Kengayish", text: "Termiz, Toshkent va Samarqandda filiallar. Jamoa 60 kishiga yetdi." },
  { year: "2026", title: "Yangi bo'lim", text: "Atelier — individual o'lchov bo'yicha tikish xizmati va olti filial tarmog'i." },
];
