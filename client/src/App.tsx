import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <HomePage key="home-page" />}
      </Route>
      <Route path="/brands/:slug">
        {(params) => <BrandPage slug={params.slug} />}
      </Route>
      <Route path="/products/:slug">
        {(params) => <ProductPage slug={params.slug} />}
      </Route>
      <Route path="/contact">
        {() => <ContactPage />}
      </Route>
      <Route path="/about">
        {() => <AboutPage />}
      </Route>
      <Route path="/new-chassis">
        {() => <NewChassisPage />}
      </Route>
      <Route path="/used-chassis">
        {() => <UsedChassisPage />}
      </Route>
      <Route path="/products">
        {() => <AllProductsPage />}
      </Route>
      {/* Tamaños de chasis */}
      <Route path="/size/:size">
        {(params) => <HomePage key={`size-${params.size}`} initialSize={params.size} />}
      </Route>
      <Route path="/sizes/20ft">
        {() => <HomePage key="size-20ft" initialSize="20ft" />}
      </Route>
      <Route path="/sizes/20-40ft">
        {() => <HomePage key="size-20-40ft" initialSize="20-40ft" />}
      </Route>
      <Route path="/sizes/40ft">
        {() => <HomePage key="size-40ft" initialSize="40ft" />}
      </Route>
      <Route path="/sizes/40-45ft">
        {() => <HomePage key="size-40-45ft" initialSize="40-45ft" />}
      </Route>
      <Route path="/sizes/20-40-45ft">
        {() => <HomePage key="size-20-40-45ft" initialSize="20-40-45ft" />}
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
    </QueryClientProvider>
  );
}

export default App;
