import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { Card } from '../card';

const ProductCard = ({ product, onFavorite, onProductClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-gray-300">
      <div onClick={() => onProductClick(product)} className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
          >
            <Heart className={`w-4 h-4 ${product.isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          
          {/* Price Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.title}</h3>
          
          {/* Location and Date */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{product.location}</span>
            <span className="mx-2">•</span>
            <span>{product.postedDate}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">{product.seller.name}</span>
            {product.seller.isVerified && (
              <div className="ml-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;