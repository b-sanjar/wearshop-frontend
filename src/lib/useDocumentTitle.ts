import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { productBySlug } from "../data/products";
import { LOOKBOOKS, JOURNAL } from "../data/content";
import { CATEGORY_LABEL } from "./format";

const STATIC: Record<string, string> = {
  "/": "Premium Fashion House",
  "/katalog": "Butun katalog",
  "/savat": "Savat",
  "/tolov": "Buyurtmani rasmiylashtirish",
  "/sevimlilar": "Sevimlilar",
  "/kirish": "Hisobga kirish",
  "/royxatdan-otish": "Ro'yxatdan o'tish",
  "/kabinet": "Shaxsiy kabinet",
  "/lookbook": "Lookbook",
  "/jurnal": "Jurnal",
  "/brend": "Brend haqida",
  "/filiallar": "Filiallar",
  "/yordam": "Savol-javob",
  "/olcham-jadvali": "O'lcham jadvali",
  "/chegirma": "Chegirmalar",
  "/qidiruv": "Qidiruv",
  "/aloqa": "Aloqa",
};

/** Keeps <title> in sync with the active route so history and tabs stay readable. */
export function useDocumentTitle() {
  const { pathname } = useLocation();
  const params = useParams();

  useEffect(() => {
    let name: string | undefined = STATIC[pathname];

    if (!name) {
      const [, section, slug] = pathname.split("/");
      if (section === "mahsulot" && slug) name = productBySlug(slug)?.name;
      else if (section === "lookbook" && slug) name = LOOKBOOKS.find((l) => l.slug === slug)?.title;
      else if (section === "jurnal" && slug) name = JOURNAL.find((p) => p.slug === slug)?.title;
      else if (section === "katalog" && slug)
        name = slug === "yangi" ? "Yangi kelganlar" : CATEGORY_LABEL[slug];
      else if (section === "buyurtma" && slug) name = `Buyurtma ${slug}`;
    }

    document.title = name ? `${name} — WEARSHOP` : "WEARSHOP — Sahifa topilmadi";
  }, [pathname, params]);
}
