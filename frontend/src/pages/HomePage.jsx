import React, { useState, useMemo } from 'react';
import Header from '../components/ui/layout/Header';
import Sidebar from '../components/ui/layout/Sidebar';
import ProductCard from '../components/ui/product/ProductCard';
import { mockProducts } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set([2, 5])); // Mock favorites
  const navigate = useNavigate();

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
    navigate(`/product/${product.id}`);
  };

  // Update products with favorite status
  const productsWithFavorites = filteredProducts.map(product => ({
    ...product,
    isFavorited: favorites.has(product.id)
  }));

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'all': return "Discover Thrift";
      case 'electronics': return 'Electronics';
      case 'fashion': return 'Fashion & Style';
      case 'vehicles': return 'Vehicles';
      case 'home': return 'Home & Garden';
      case 'books': return 'Books & Media';
      case 'sports': return 'Sports & Hobbies';
      case 'collectibles': return 'Vintage & Collectibles';
      default: return 'Products';
    }
  };

  const getCategorySubtitle = () => {
    switch (activeCategory) {
      case 'all': return "Pre-loved treasures waiting for new owners";
      case 'electronics': return 'Quality second-hand electronics';
      case 'fashion': return 'Curated pre-owned fashion finds';
      case 'vehicles': return 'Trusted pre-owned vehicles';
      case 'home': return 'Beautiful home essentials';
      case 'books': return 'Stories ready for new readers';
      case 'sports': return 'Gently used sports equipment';
      case 'collectibles': return 'Unique vintage discoveries';
      default: return 'Quality thrift finds';
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
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Category Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {getCategoryTitle()}
              </h1>
              <p className="text-gray-500 text-lg mb-1">
                {getCategorySubtitle()}
              </p>
              <p className="text-sm text-gray-400">
                {filteredProducts.length} items available
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="text-center py-16">
                <div className="text-gray-300 text-8xl mb-6">🔍</div>
                <h3 className="text-xl font-light text-gray-900 mb-3">
                  Nothing here yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No thrift items found in this category. Try browsing other categories or check back later for new treasures.
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