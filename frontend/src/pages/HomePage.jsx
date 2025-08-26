import React, { useState, useEffect } from 'react';
import Header from '../components/ui/layout/Header';
import Sidebar from '../components/ui/layout/Sidebar';
import ProductCard from '../components/ui/product/ProductCard';
import { productsAPI, favoritesAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        
        const data = await productsAPI.getProducts(params);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, toast]);

  // Fetch user favorites if authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const favoriteProducts = await favoritesAPI.getFavorites();
          const favoriteIds = new Set(favoriteProducts.map(p => p.id));
          setFavorites(favoriteIds);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const handleFavorite = async (productId) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save favorites.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const isFavorited = favorites.has(productId);
      
      if (isFavorited) {
        await favoritesAPI.removeFavorite(productId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
        toast({
          title: "Removed from favorites",
          description: "Item removed from your favorites list."
        });
      } else {
        await favoritesAPI.addFavorite(productId);
        setFavorites(prev => new Set([...prev, productId]));
        toast({
          title: "Added to favorites",
          description: "Item saved to your favorites list."
        });
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Update products with favorite status
  const productsWithFavorites = products.map(product => ({
    ...product,
    isFavorited: favorites.has(product.id),
    // Format the data for the ProductCard component
    postedDate: new Date(product.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    }) + ' ago'
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
                {productsWithFavorites.length} items available
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl aspect-square mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && productsWithFavorites.length > 0 && (
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
            )}

            {/* Empty State */}
            {!isLoading && productsWithFavorites.length === 0 && (
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