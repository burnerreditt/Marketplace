import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft, Image, Paperclip } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Header from '../components/ui/layout/Header';
import { mockMessages, mockProducts } from '../utils/mockData';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(mockMessages[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations list
  const conversations = [
    {
      id: 1,
      buyerId: 2,
      sellerId: 1,
      productId: 1,
      product: mockProducts[0],
      otherUser: {
        id: 2,
        name: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
        isOnline: true,
        lastSeen: "Just now"
      },
      lastMessage: {
        text: "Can we meet for inspection? I'm in Mumbai too.",
        timestamp: "2024-01-20T10:40:00Z",
        isRead: false
      },
      unreadCount: 1
    },
    {
      id: 2,
      buyerId: 1,
      sellerId: 3,
      productId: 3,
      product: mockProducts[2],
      otherUser: {
        id: 3,
        name: "Amit Kumar",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        isOnline: false,
        lastSeen: "2 hours ago"
      },
      lastMessage: {
        text: "The apartment is still available. When would you like to visit?",
        timestamp: "2024-01-20T08:15:00Z",
        isRead: true
      },
      unreadCount: 0
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(mockMessages.find(m => m.id === conversation.id))}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conversation.otherUser.avatar}
                        alt={conversation.otherUser.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {conversation.otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage.text}
                      </p>
                      
                      {/* Product Preview */}
                      <div className="flex items-center space-x-2">
                        <img
                          src={conversation.product.images[0]}
                          alt={conversation.product.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-xs text-gray-500 truncate">
                          {conversation.product.title}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-auto">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="icon" className="lg:hidden">
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <img
                        src={conversations.find(c => c.id === selectedChat.id)?.otherUser.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      
                      <div>
                        <h3 className="font-medium">
                          {conversations.find(c => c.id === selectedChat.id)?.otherUser.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {conversations.find(c => c.id === selectedChat.id)?.otherUser.isOnline 
                            ? 'Active now' 
                            : `Last seen ${conversations.find(c => c.id === selectedChat.id)?.otherUser.lastSeen}`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversations.find(c => c.id === selectedChat.id)?.product.images[0]}
                        alt="Product"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {conversations.find(c => c.id === selectedChat.id)?.product.title}
                        </h4>
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(conversations.find(c => c.id === selectedChat.id)?.product.price)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Item</Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((message) => {
                    const isOwnMessage = message.senderId === 1; // Assuming user ID 1 is current user
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Button type="button" variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose from your existing conversations or start a new one
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;