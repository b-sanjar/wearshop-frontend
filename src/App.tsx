import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Aurora } from "./components/layout/Aurora";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { MobileNav } from "./components/layout/MobileNav";
import { SearchOverlay } from "./components/layout/SearchOverlay";
import { Toasts } from "./components/ui/Toasts";
import { QuickView } from "./components/ui/QuickView";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { prefersReducedMotion } from "./lib/hooks";
import { useDocumentTitle } from "./lib/useDocumentTitle";
import { useImageStates } from "./lib/useImageStates";
import Home from "./pages/Home";

const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Account = lazy(() => import("./pages/Account"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const LookbookStory = lazy(() => import("./pages/LookbookStory"));
const Journal = lazy(() => import("./pages/Journal"));
const JournalPost = lazy(() => import("./pages/JournalPost"));
const About = lazy(() => import("./pages/About"));
const Stores = lazy(() => import("./pages/Stores"));
const Faq = lazy(() => import("./pages/Faq"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const Sale = lazy(() => import("./pages/Sale"));
const Search = lazy(() => import("./pages/Search"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function DocumentTitle() {
  useDocumentTitle();
  return null;
}

function ImageStates() {
  useImageStates();
  return null;
}

function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

function RouteFallback() {
  return (
    <div className="route-fallback">
      <span className="route-fallback__bar" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <DocumentTitle />
      <ImageStates />
      <ScrollProgress />
      <Aurora />
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          {/* Keyed on the path so each route plays its entrance */}
          <div className="route-shell" key={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/katalog" element={<Shop />} />
              <Route path="/katalog/:category" element={<Shop />} />
              <Route path="/mahsulot/:slug" element={<Product />} />
              <Route path="/savat" element={<Cart />} />
              <Route path="/tolov" element={<Checkout />} />
              <Route path="/buyurtma/:id" element={<OrderSuccess />} />
              <Route path="/sevimlilar" element={<Wishlist />} />
              <Route path="/kirish" element={<Login />} />
              <Route path="/royxatdan-otish" element={<Register />} />
              <Route path="/kabinet" element={<Account />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/lookbook/:slug" element={<LookbookStory />} />
              <Route path="/jurnal" element={<Journal />} />
              <Route path="/jurnal/:slug" element={<JournalPost />} />
              <Route path="/brend" element={<About />} />
              <Route path="/filiallar" element={<Stores />} />
              <Route path="/yordam" element={<Faq />} />
              <Route path="/olcham-jadvali" element={<SizeGuide />} />
              <Route path="/chegirma" element={<Sale />} />
              <Route path="/qidiruv" element={<Search />} />
              <Route path="/aloqa" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <SearchOverlay />
      <QuickView />
      <Toasts />
    </>
  );
}
