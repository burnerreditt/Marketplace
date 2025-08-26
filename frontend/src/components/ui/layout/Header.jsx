import React, { useState } from 'react';
import { Search, ShoppingBag, MessageCircle, User, Bell, Plus } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-blue-600">Desi Marketplace</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Marketplace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-100 border-none rounded-full focus:bg-white focus:shadow-md transition-all"
              />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center space-x-2"
              onClick={() => navigate('/create')}
            >
              <Plus className="w-4 h-4" />
              <span>Sell</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;