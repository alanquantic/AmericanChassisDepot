import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ProductGrid from '@/components/home/ProductGrid';
import { useLanguage } from '@/lib/i18n-simple';
import Seo from '@/components/seo/Seo';

const AllProductsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div>
      <Seo
        title={language === 'es'
          ? 'Todos los Chassis para Contenedores | American Chassis Depot'
          : 'All Container Chassis | American Chassis Depot'}
        description={language === 'es'
          ? 'Explore nuestra línea completa de chassis para contenedores: 20ft, 33ft, 40ft, 45ft, extensibles, triaxiales y gooseneck. Nuevos y usados disponibles.'
          : 'Explore our full line of container chassis: 20ft, 33ft, 40ft, 45ft, extendable, triaxle, and gooseneck. New and used available.'}
        canonicalPath={`/${language}/products`}
      />
      <Header />
      <main>
        <ProductGrid initialSize="all" showOnlyNew={false} />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default AllProductsPage;