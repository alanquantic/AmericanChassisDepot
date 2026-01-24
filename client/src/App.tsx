import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { getCurrentLanguage, setLanguage } from "@/lib/i18n-simple";
import { usePageTracking } from "./hooks/use-page-tracking";
import ElevenLabsWidget from "@/components/shared/ElevenLabsWidget";

// Marketplace Pages
import { MarketplacePage, ListingDetailPage, DashboardPage, AdminPage, LoginPage, RegisterPage } from "@/pages/marketplace";

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
      
      {/* ========== MARKETPLACE ROUTES ========== */}
      {/* Marketplace main page */}
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
      
      {/* Marketplace admin */}
      <Route path="/:lang/marketplace/admin">
        {(params) => {
          const lang = params.lang === 'es' ? 'es' : 'en';
          setLanguage(lang);
          return <AdminPage key={`admin-${lang}`} />;
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
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <ElevenLabsWidget />
    </QueryClientProvider>
  );
}

export default App;
