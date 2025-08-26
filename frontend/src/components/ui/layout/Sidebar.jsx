import React from 'react';
import { Home, Grid, Car, Home as HomeIcon, Smartphone, Gamepad2, ShoppingBag, Briefcase, MapPin, Filter } from 'lucide-react';

const Sidebar = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'Browse all', icon: Grid },
    { id: 'vehicles', name: 'Vehicles', icon: Car },
    { id: 'property', name: 'Property Rentals', icon: HomeIcon },
    { id: 'electronics', name: 'Electronics', icon: Smartphone },
    { id: 'entertainment', name: 'Entertainment', icon: Gamepad2 },
    { id: 'apparel', name: 'Apparel', icon: ShoppingBag },
    { id: 'classifieds', name: 'Classifieds', icon: Briefcase }
  ];

  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Pune, Maharashtra'
  ];

  const priceRanges = [
    'Under ₹500',
    '₹500 - ₹2,000',
    '₹2,000 - ₹10,000',
    '₹10,000 - ₹50,000',
    'Above ₹50,000'
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        {/* Marketplace Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Marketplace</h2>

        {/* Categories */}
        <div className="mb-8">
          <div className="space-y-1">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          </div>
          <div className="space-y-2">
            {locations.map((location, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
          </div>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;