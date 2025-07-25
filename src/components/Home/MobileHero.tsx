import React from 'react';
import { ArrowRight, ShoppingBag, Users, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MobileHero: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleGetStarted = () => {
    if (userProfile) {
      navigate('/marketplace');
    } else {
      navigate('/auth?mode=signup');
    }
  };

  const categories = [
    { name: 'Food & Agriculture', icon: '🌾', color: 'bg-green-100 text-green-700' },
    { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-700' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-100 text-pink-700' },
    { name: 'Home & Garden', icon: '🏠', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Health & Beauty', icon: '💄', color: 'bg-purple-100 text-purple-700' },
    { name: 'Sports & Fitness', icon: '⚽', color: 'bg-red-100 text-red-700' }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Products', value: '5K+', icon: ShoppingBag },
    { label: 'Orders', value: '50K+', icon: TrendingUp }
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-3">
              Nigeria's Premier
              <span className="block text-yellow-300">Marketplace</span>
            </h1>
            <p className="text-purple-100 text-sm leading-relaxed mb-6">
              Connect with thousands of verified sellers across Nigeria. 
              Discover quality products and grow your business.
            </p>
            
            <button
              onClick={handleGetStarted}
              className="w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>{userProfile ? 'Browse Marketplace' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => navigate('/marketplace')}
              className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                  <span className="text-lg">{category.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-6 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Ready9ja?</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Secure Transactions</h3>
              <p className="text-gray-600 text-xs">Safe payments with buyer protection</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Verified Sellers</h3>
              <p className="text-gray-600 text-xs">Connect with trusted sellers nationwide</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Wide Selection</h3>
              <p className="text-gray-600 text-xs">Thousands of products across categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Ready to Start Selling?</h2>
          <p className="text-purple-100 text-sm mb-6">
            Join thousands of successful sellers and start your online business today.
          </p>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="w-full bg-white text-purple-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Start Selling Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileHero;