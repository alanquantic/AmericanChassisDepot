import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BrandPage from "@/pages/BrandPage";
import ProductPage from "@/pages/ProductPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import NewChassisPage from "@/pages/NewChassisPage";
import UsedChassisPage from "@/pages/UsedChassisPage";
import AllProductsPage from "@/pages/AllProductsPage";
import LandingPage from "@/pages/LandingPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ArticlePage from "@/pages/ArticlePage";
import { getCurrentLanguage, setLanguage } from "@/lib/i18n-simple";
import { usePageTracking } from "./hooks/use-page-tracking";
import ElevenLabsWidget from "@/components/shared/ElevenLabsWidget";

// Marketplace Pages
import { MarketplacePage, ListingDetailPage, DashboardPage, AdminPage, MarketplaceLandingPage, SellerListingsPage, ListingImagesPage, CreateListingPage, ManualUserPage, ManualAdminPage, LoginPage, RegisterPage } from "@/pages/marketplace";

function Router() {
  const [location, navigate] = useLocation();
  
  // Activar tracking de páginas
  usePageTracking();

  // Redirect root to language-prefixed path
  if (location === "/") {
    const lang = getCurrentLanguage() || 'en';
    navigate(`/${lang}`);
  }

  return (
    <Switch>
      {/* Language-prefixed routes */}
      <Route path="/:lang">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <HomePage key={`home-${lang}`} />;
        }}
      </Route>
      <Route path="/:lang/brands/:slug">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <BrandPage slug={params.slug} />;
        }}
      </Route>
      <Route path="/:lang/products/:slug">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ProductPage slug={params.slug} />;
        }}
      </Route>
      <Route path="/:lang/contact">
        {(params) => {
          setLanguage(params.lang === 'es' ? 'es' : 'en');
          return <ContactPage />;
        }}
      </Route>
      <Route path="/:lang/about">
        {(params) => {
          setLanguage(params.lang === 'es' ? 'es' : 'en');
          return <AboutPage />;
        }}
      </Route>
      <Route path="/:lang/new-chassis">
        {(params) => {
          setLanguage(params.lang === 'es' ? 'es' : 'en');
          return <NewChassisPage />;
        }}
      </Route>
      <Route path="/:lang/used-chassis">
        {(params) => {
          setLanguage(params.lang === 'es' ? 'es' : 'en');
          return <UsedChassisPage />;
        }}
      </Route>
      <Route path="/:lang/products">
        {(params) => {
          setLanguage(params.lang === 'es' ? 'es' : 'en');
          return <AllProductsPage />;
        }}
      </Route>
      {/* Tamaños de chasis */}
      <Route path="/:lang/size/:size">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <HomePage key={`size-${params.size}-${lang}`} initialSize={params.size} />;
        }}
      </Route>

      {/* SEO intent landing pages (Phase 2) — product pages */}
      <Route path="/:lang/container-chassis/:size">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LandingPage slug={`container-chassis/${params.size}`} key={`lp-${params.size}-${lang}`} />;
        }}
      </Route>

      {/* SEO intent landing pages (Phase 2) — service pages */}
      <Route path="/:lang/chassis-leasing">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LandingPage slug="chassis-leasing" key={`lp-leasing-${lang}`} />;
        }}
      </Route>
      <Route path="/:lang/lease-to-own">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LandingPage slug="lease-to-own" key={`lp-lto-${lang}`} />;
        }}
      </Route>
      <Route path="/:lang/fleet-sales">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LandingPage slug="fleet-sales" key={`lp-fleet-${lang}`} />;
        }}
      </Route>

      {/* SEO intent landing pages (Phase 2) — location pages */}
      <Route path="/:lang/locations/:place">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LandingPage slug={`locations/${params.place}`} key={`lp-loc-${params.place}-${lang}`} />;
        }}
      </Route>

      {/* Resources blog (SEO Phase 3.2) */}
      <Route path="/:lang/resources/:slug">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ArticlePage slug={params.slug} key={`article-${params.slug}-${lang}`} />;
        }}
      </Route>
      <Route path="/:lang/resources">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ResourcesPage key={`resources-${lang}`} />;
        }}
      </Route>

      {/* ========== MARKETPLACE ROUTES ========== */}
      {/* Marketplace Landing Page (Marketing) */}
      <Route path="/:lang/marketplace">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <MarketplaceLandingPage key={`marketplace-landing-${lang}`} />;
        }}
      </Route>
      
      {/* Marketplace main page (Browse listings) */}
      <Route path="/:lang/chassis-marketplace">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <MarketplacePage key={`marketplace-${lang}`} />;
        }}
      </Route>
      
      {/* Marketplace listing detail */}
      <Route path="/:lang/chassis-marketplace/:slug">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ListingDetailPage slug={params.slug} key={`listing-${params.slug}`} />;
        }}
      </Route>
      
      {/* Marketplace auth */}
      <Route path="/:lang/marketplace/login">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <LoginPage key={`login-${lang}`} />;
        }}
      </Route>
      
      <Route path="/:lang/marketplace/register">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <RegisterPage key={`register-${lang}`} />;
        }}
      </Route>
      
      {/* Marketplace dashboard */}
      <Route path="/:lang/marketplace/dashboard">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <DashboardPage key={`dashboard-${lang}`} />;
        }}
      </Route>
      
      {/* Seller listings management */}
      <Route path="/:lang/marketplace/seller/listings">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <SellerListingsPage key={`seller-listings-${lang}`} />;
        }}
      </Route>
      
      {/* Create new listing */}
      <Route path="/:lang/marketplace/seller/create">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <CreateListingPage key={`create-listing-${lang}`} />;
        }}
      </Route>
      
      {/* Listing images management */}
      <Route path="/:lang/marketplace/seller/listings/:id/images">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ListingImagesPage key={`listing-images-${params.id}`} />;
        }}
      </Route>
      
      {/* Marketplace admin */}
      <Route path="/:lang/marketplace/admin">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <AdminPage key={`admin-${lang}`} />;
        }}
      </Route>
      
      {/* Documentation - User Manual (noindex) */}
      <Route path="/:lang/marketplace/manual/user">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ManualUserPage key={`manual-user-${lang}`} />;
        }}
      </Route>
      
      {/* Documentation - Admin Manual (noindex) */}
      <Route path="/:lang/marketplace/manual/admin">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <ManualAdminPage key={`manual-admin-${lang}`} />;
        }}
      </Route>
      
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
        <ElevenLabsWidget />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
