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
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 bg-white rounded-xl overflow-hidden">
      <div onClick={() => onProductClick(product)} className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200 backdrop-blur-sm"
          >
            <Heart className={`w-4 h-4 transition-colors ${product.isFavorited ? 'fill-gray-900 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`} />
          </button>
          
          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
              <span className="text-xs font-medium text-white">{product.condition}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className="text-lg font-semibold text-gray-900">{formatPrice(product.price)}</span>
          </div>
          
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm leading-relaxed">{product.title}</h3>
          
          {/* Location and Date */}
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{product.location.split(',')[0]}</span>
            <span className="mx-2">•</span>
            <span>{product.postedDate}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 overflow-hidden">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{product.seller.name}</span>
              {product.seller.isVerified && (
                <div className="ml-1 w-3 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex items-center">
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;