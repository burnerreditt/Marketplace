import React, { useState, useMemo } from 'react';
import Header from '../components/ui/layout/Header';
import Sidebar from '../components/ui/layout/Sidebar';
import ProductCard from '../components/ui/product/ProductCard';
import { mockProducts } from '../utils/mockData';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set([2, 5])); // Mock favorites

  // Filter products based on active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return mockProducts;
    }
    return mockProducts.filter(product => product.category === activeCategory);
  }, [activeCategory]);

  const handleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleProductClick = (product) => {
    // Navigate to product detail page (will implement routing later)
    console.log('Product clicked:', product);
  };

  // Update products with favorite status
  const productsWithFavorites = filteredProducts.map(product => ({
    ...product,
    isFavorited: favorites.has(product.id)
  }));

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'all': return "Today's picks";
      case 'vehicles': return 'Vehicles';
      case 'property': return 'Property Rentals';
      case 'electronics': return 'Electronics';
      case 'entertainment': return 'Entertainment';
      case 'apparel': return 'Apparel';
      case 'classifieds': return 'Classifieds';
      default: return 'Products';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Category Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {getCategoryTitle()}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} items • {activeCategory === 'all' ? 'All categories' : activeCategory}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productsWithFavorites.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavorite={handleFavorite}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later for new listings.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;