import type { Product, ProductColor, Review, PromoCode } from "./types";

const u = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const IMG = {
  erkaklar: [
    u("photo-1617137968427-85924c800a22"),
    u("photo-1516257984-b1b4d707412e"),
    u("photo-1488161628813-04466f872be2"),
    u("photo-1520975954732-35dd22299614"),
    u("photo-1507003211169-0a1dd7228f2d"),
    u("photo-1490578474895-699cd4e2cf59"),
    u("photo-1550246140-29f40b909e5a"),
    u("photo-1519085360753-af0119f7cbe7"),
    u("photo-1492447166138-50c3889fccb1"),
    u("photo-1506794778202-cad84cf45f1d"),
    u("photo-1531891437562-4301cf35b7e4"),
    u("photo-1603252109303-2751441dd157"),
  ],
  ayollar: [
    u("photo-1483985988355-763728e1935b"),
    u("photo-1509631179647-0177331693ae"),
    u("photo-1515372039744-b8f02a3ae446"),
    u("photo-1495385794356-15371f348c31"),
    u("photo-1524504388940-b1c1722653e1"),
    u("photo-1469334031218-e382a71b716b"),
    u("photo-1485968579580-b6d095142e6e"),
    u("photo-1487412947147-5cebf100ffc2"),
    u("photo-1502716119720-b23a93e5fe1b"),
    u("photo-1496747611176-843222e1e57c"),
    u("photo-1539109136881-3be0616acf4b"),
    u("photo-1581044777550-4cfa60707c03"),
  ],
  unisex: [
    u("photo-1521572163474-6864f9cf17ab"),
    u("photo-1556821840-3a9fbc2aeb4e"),
    u("photo-1564557287817-3785e38ec1f5"),
    u("photo-1578681994506-b8f463449011"),
    u("photo-1620799140408-edc6dcb6d633"),
    u("photo-1618354691373-d851c5c3a990"),
    u("photo-1503341504253-dff4815485f1"),
    u("photo-1529374255404-311a2a4f16fd"),
    u("photo-1554568218-0f1715e72254"),
    u("photo-1571945153237-4929e783af4a"),
    u("photo-1583743814966-8936f5b7be1a"),
    u("photo-1596755094514-f87e34085b2c"),
  ],
  aksessuar: [
    u("photo-1553062407-98eeb64c6a62"),
    u("photo-1548036328-c9fa89d128fa"),
    u("photo-1611085583191-a3b181a88401"),
    u("photo-1590874103328-eac38a683ce7"),
    u("photo-1611652022419-a9419f74343d"),
    u("photo-1559563458-527698bf5295"),
    u("photo-1524805444758-089113d48a6d"),
    u("photo-1622560480605-d83c853bc5c3"),
  ],
};

const PALETTES: ProductColor[][] = [
  [
    { name: "Qora", hex: "#1a1a1a" },
    { name: "Qum", hex: "#cbb99a" },
    { name: "Terrakota", hex: "#b0552b" },
  ],
  [
    { name: "Oq suyak", hex: "#ece7dd" },
    { name: "Zaytun", hex: "#5f6b46" },
    { name: "Qora", hex: "#1a1a1a" },
  ],
  [
    { name: "Kofe", hex: "#5b4636" },
    { name: "Krem", hex: "#e8e0d0" },
  ],
  [
    { name: "Grafit", hex: "#3a3a3a" },
    { name: "Jigarrang", hex: "#7a5236" },
    { name: "Oq", hex: "#f4f1ea" },
  ],
  [
    { name: "Tungi ko'k", hex: "#2b3648" },
    { name: "Kul", hex: "#a8a294" },
  ],
];

const SIZE_SETS: Record<string, string[]> = {
  default: ["XS", "S", "M", "L", "XL"],
  outer: ["S", "M", "L", "XL", "XXL"],
  aksessuar: ["Yagona"],
};

interface Seed {
  name: string;
  fabric: string;
  coll: string;
  outer?: boolean;
}

const SEEDS: Record<string, Seed[]> = {
  erkaklar: [
    { name: "Atelier Oversize Ko'ylak", fabric: "100% yuvilgan paxta poplin", coll: "Atelier" },
    { name: "Sartorial Jun Palto", fabric: "80% jun, 20% kashmir", coll: "Sartorial", outer: true },
    { name: "Raw Denim Kurtka", fabric: "14 oz yaponcha raw denim", coll: "Denim Lab", outer: true },
    { name: "Merino Turtleneck", fabric: "100% extra-fine merino jun", coll: "Knitwear" },
    { name: "Pleated Klassik Shim", fabric: "Virgin jun gabardin", coll: "Sartorial" },
    { name: "Signature Bomber", fabric: "Texnik nylon, matte finish", coll: "Motion", outer: true },
    { name: "Havoreng Oxford Ko'ylak", fabric: "Oxford paxta, garment-dyed", coll: "Essentials" },
    { name: "Struktura Blazer", fabric: "Yarim kanvas jun aralashma", coll: "Sartorial", outer: true },
    { name: "Suede Overshirt", fabric: "Italyan suede charm", coll: "Atelier", outer: true },
    { name: "Tailored Chino", fabric: "Paxta-elastan sarja", coll: "Essentials" },
    { name: "Heavy Fleece Hoodie", fabric: "480 gsm cho'tkalangan paxta", coll: "Motion" },
    { name: "Double-Face Kardigan", fabric: "Jun-alpaka aralashma", coll: "Knitwear" },
  ],
  ayollar: [
    { name: "Silk Slip Ko'ylak", fabric: "100% tut ipagi, 22 momme", coll: "Soirée" },
    { name: "Sculpted Blazer", fabric: "Virgin jun, strukturali yelka", coll: "Sartorial", outer: true },
    { name: "Bias-Cut Midi Yubka", fabric: "Viskoza krep", coll: "Soirée" },
    { name: "Kashmir V-Neck Sviter", fabric: "100% Mo'g'uliston kashmiri", coll: "Knitwear" },
    { name: "Wide-Leg Linen Shim", fabric: "Yevropa zig'iri", coll: "Riviera" },
    { name: "Draped Wrap Ko'ylak", fabric: "Ipak-viskoza aralashma", coll: "Soirée" },
    { name: "Cropped Trench", fabric: "Suv o'tkazmas paxta gabardin", coll: "Atelier", outer: true },
    { name: "Ribbed Knit Set", fabric: "Merino-tencel aralashma", coll: "Knitwear" },
    { name: "Poplin Maxi Ko'ylak", fabric: "Organik paxta poplin", coll: "Riviera" },
    { name: "Tailored Sigaret Shim", fabric: "Jun-elastan aralashma", coll: "Sartorial" },
    { name: "Satin Camisole", fabric: "Sandwashed ipak satin", coll: "Soirée" },
    { name: "Bouclé Jaket", fabric: "Jun bouclé tvid", coll: "Atelier", outer: true },
  ],
  unisex: [
    { name: "Essential Heavy Tee", fabric: "240 gsm supima paxta", coll: "Essentials" },
    { name: "Cloud Crewneck", fabric: "Fransuz teri paxta", coll: "Essentials" },
    { name: "Utility Cargo Shim", fabric: "Ripstop paxta-nylon", coll: "Motion" },
    { name: "Boxy Denim Jaket", fabric: "13 oz selvedge denim", coll: "Denim Lab", outer: true },
    { name: "Tech Anorak", fabric: "3L membrana, seam-sealed", coll: "Motion", outer: true },
    { name: "Relaxed Jogger", fabric: "Loopback paxta jersey", coll: "Motion" },
    { name: "Mock-Neck Longsleeve", fabric: "Interlock paxta", coll: "Essentials" },
    { name: "Quilted Liner Jaket", fabric: "Recycled nylon, PrimaLoft", coll: "Motion", outer: true },
    { name: "Wide Denim Shim", fabric: "12 oz yumshoq denim", coll: "Denim Lab" },
    { name: "Zip Track Jaket", fabric: "Texnik trikotaj", coll: "Motion" },
    { name: "Oversize Flannel", fabric: "Cho'tkalangan paxta flanel", coll: "Essentials", outer: true },
    { name: "Core Half-Zip", fabric: "Merino aralashma trikotaj", coll: "Knitwear" },
  ],
  aksessuar: [
    { name: "Struttura Charm Sumka", fabric: "To'liq donali italyan charmi", coll: "Atelier" },
    { name: "Jun Sharf", fabric: "Lambswool-kashmir", coll: "Knitwear" },
    { name: "Minimal Teri Kamar", fabric: "Vegetable-tanned charm", coll: "Essentials" },
    { name: "Canvas Tote", fabric: "18 oz og'ir kanvas", coll: "Essentials" },
    { name: "Beanie Ribbed", fabric: "100% merino jun", coll: "Knitwear" },
    { name: "Suede Card Holder", fabric: "Italyan suede", coll: "Atelier" },
    { name: "Silk Twilly", fabric: "100% ipak twill", coll: "Soirée" },
    { name: "Leather Gloves", fabric: "Nappa charm, kashmir astar", coll: "Atelier" },
  ],
};

const CARE = [
  "30°C da nozik rejimda yuving",
  "Oqartirgich ishlatmang",
  "Past haroratda dazmollang",
  "Quritgichda quritmang",
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function build(): Product[] {
  const products: Product[] = [];
  let i = 0;
  for (const [category, seeds] of Object.entries(SEEDS)) {
    const pool = IMG[category as keyof typeof IMG];
    seeds.forEach((seed, j) => {
      const base =
        category === "aksessuar"
          ? 240_000 + (i % 9) * 65_000
          : 320_000 + (i % 12) * 85_000 + (seed.outer ? 420_000 : 0);
      const discount = i % 5 === 0 ? 20 : i % 7 === 0 ? 30 : i % 3 === 0 ? 12 : 0;
      const popularity = 62 + ((i * 13) % 37);
      const isNew = i % 3 === 0;
      const rating = Number((4.2 + ((i * 7) % 8) * 0.1).toFixed(1));
      const tags: string[] = [];
      if (discount >= 20) tags.push("sale");
      else if (discount > 0) tags.push("discount");
      if (isNew) tags.push("new");
      if (popularity >= 90) tags.push("bestseller");
      if (base >= 900_000) tags.push("premium");

      const img1 = pool[j % pool.length];
      const img2 = pool[(j + 3) % pool.length];
      const img3 = pool[(j + 7) % pool.length];

      products.push({
        id: `ws-${1000 + i}`,
        slug: slugify(seed.name),
        name: seed.name,
        category: category as Product["category"],
        collection: seed.coll,
        price: base,
        discount,
        rating,
        ratingCount: 14 + ((i * 11) % 220),
        popularity,
        isNew,
        tags,
        colors: PALETTES[i % PALETTES.length],
        sizes: category === "aksessuar" ? SIZE_SETS.aksessuar : seed.outer ? SIZE_SETS.outer : SIZE_SETS.default,
        description: `${seed.name} — ${seed.coll} kolleksiyasidan. ${seed.fabric} asosida tikilgan, zamonaviy silueti va mukammal detallari bilan har qanday garderobning tayanch elementiga aylanadi. Har bir buyum kichik partiyalarda, sifat nazorati ostida ishlab chiqariladi.`,
        fabric: seed.fabric,
        care: CARE,
        images: [img1, img2, img3],
        stock: i % 11 === 0 ? 3 : 12 + ((i * 5) % 40),
      });
      i += 1;
    });
  }
  return products;
}

export const PRODUCTS: Product[] = build();

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const effectivePrice = (p: { price: number; discount: number }) =>
  Math.round(p.price * (1 - p.discount / 100));

export const relatedProducts = (p: Product, n = 4) =>
  PRODUCTS.filter((x) => x.id !== p.id && (x.category === p.category || x.collection === p.collection))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, n);

export const COLLECTIONS = [...new Set(PRODUCTS.map((p) => p.collection))];

export const PROMOS: PromoCode[] = [
  { code: "WELCOME10", type: "percent", value: 10, minOrder: 200_000, label: "Yangi mijozlar uchun −10%" },
  { code: "PREMIUM15", type: "percent", value: 15, minOrder: 900_000, label: "900 ming so'mdan oshgan savatga −15%" },
  { code: "SHIPFREE", type: "freeship", value: 0, minOrder: 150_000, label: "Bepul yetkazib berish" },
];

export const SHIPPING_FEE = 30_000;
export const FREE_SHIPPING_FROM = 500_000;

const REVIEW_AUTHORS = ["Aziza R.", "Jasur T.", "Malika S.", "Bekzod A.", "Nilufar K.", "Sardor M.", "Dildora Y.", "Timur B."];
const REVIEW_TEXTS = [
  "Sifati kutganimdan ham yuqori. Matosi juda yoqimli, kesimi ideal o'tirdi.",
  "Uchinchi buyurtmam — har safar qadoqlash va sifat yuqori darajada.",
  "O'lchami aynan jadvaldagidek. Rangdagi chuqurlik fotoda ko'ringanidan chiroyliroq.",
  "Narxiga munosib premium buyum. Tikuvlari toza, detallariga e'tibor berilgan.",
  "Sovg'a sifatida oldim, juda manzur bo'ldi. Yetkazish ham tez.",
  "Yarim yildan beri kiyaman, shakli va rangi o'zgargani yo'q.",
];

export const seedReviews = (productId: string): Review[] => {
  const n = 2 + (productId.charCodeAt(3) % 3);
  return Array.from({ length: n }, (_, k) => ({
    id: `${productId}-r${k}`,
    productId,
    author: REVIEW_AUTHORS[(productId.charCodeAt(4) + k * 3) % REVIEW_AUTHORS.length],
    rating: 4 + ((productId.charCodeAt(5) + k) % 2),
    comment: REVIEW_TEXTS[(productId.charCodeAt(4) + k * 5) % REVIEW_TEXTS.length],
    date: `2026-0${1 + (k % 6)}-1${k + 2}`,
  }));
};
