import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingCart, 
  TrendingUp,
  Star,
  MapPin,
  Clock,
  Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import MobileProductCard from '../Marketplace/MobileProductCard';

const BuyerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️' },
    { id: 'Food & Agriculture', name: 'Food', icon: '🌾' },
    { id: 'Electronics', name: 'Electronics', icon: '📱' },
    { id: 'Fashion', name: 'Fashion', icon: '👕' },
    { id: 'Home & Garden', name: 'Home', icon: '🏠' },
    { id: 'Health & Beauty', name: 'Beauty', icon: '💄' },
    { id: 'Sports & Fitness', name: 'Sports', icon: '⚽' }
  ];

  const featuredProducts = products.slice(0, 6);
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const quickActions = [
    { icon: ShoppingCart, label: 'My Cart', path: '/cart', color: 'bg-blue-500' },
    { icon: Heart, label: 'Favorites', path: '/favorites', color: 'bg-red-500' },
    { icon: Clock, label: 'Orders', path: '/orders', color: 'bg-green-500' },
    { icon: Gift, label: 'Referrals', path: '/referrals', color: 'bg-purple-500' }
  ];

  return (
    <div className="pb-20 bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">
                Welcome back, {userProfile?.displayName?.split(' ')[0]}! 👋
              </h1>
              <p className="text-purple-100 text-sm">Discover amazing products today</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {userProfile?.displayName?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              onFocus={() => navigate('/marketplace')}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6 -mt-4 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Shop by Category</h2>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border transition-colors ${
                selectedCategory === category.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Featured Products</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-purple-600 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {featuredProducts.map(product => (
              <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <MobileProductCard
                  product={product}
                  onAddToCart={(product) => console.log('Add to cart:', product)}
                  onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
                  onChat={(sellerId, productId) => console.log('Chat with seller:', sellerId, productId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Trending Now</h3>
          </div>
          <p className="text-sm opacity-90 mb-3">
            Don't miss out on the hottest products this week!
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-white text-orange-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Explore Trending
          </button>
        </div>
      </div>

      {/* Referral Banner */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Earn with Referrals</h3>
              <p className="text-sm opacity-90">Invite friends and earn bonuses!</p>
            </div>
            <Gift className="w-8 h-8 opacity-80" />
          </div>
          <button
            onClick={() => navigate('/referrals')}
            className="bg-white text-green-500 px-4 py-2 rounded-lg text-sm font-medium mt-3"
          >
            Start Earning
          </button>
        </div>
      </div>
    </div>
  );
};


export default BuyerDashboard;