import React, { useState } from 'react';
import { Search, MessageCircle, User, Bell, Plus } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-spartan font-light text-gray-900">Thrift<span className="font-medium">Hub</span></h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search thrift items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 w-full bg-gray-50 border-0 rounded-full focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all text-sm"
              />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-full px-4"
              onClick={() => navigate('/create')}
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Sell</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gray-50 rounded-full w-10 h-10"
              onClick={() => navigate('/messages')}
            >
              <MessageCircle className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-50 rounded-full w-10 h-10">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-50 rounded-full w-10 h-10" onClick={() => navigate('/login')}>
              <User className="w-5 h-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;