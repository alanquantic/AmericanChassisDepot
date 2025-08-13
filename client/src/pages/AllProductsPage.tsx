import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ProductGrid from '@/components/home/ProductGrid';

const AllProductsPage: React.FC = () => {
  return (
    <div>
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