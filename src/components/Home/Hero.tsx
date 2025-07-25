import React from 'react';
import { Search, ShoppingBag, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleGetStarted = () => {
    if (userProfile) {
      navigate('/marketplace');
    } else {
      navigate('/auth?mode=signup');
    }
  };

  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Product Range',
      description: 'From fresh produce to electronics, find everything you need'
    },
    {
      icon: Users,
      title: 'Trusted Sellers',
      description: 'Connect with verified sellers across Nigeria'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and secure payment processing with order protection'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Nigeria's Premier
            <span className="block bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect buyers and sellers across Nigeria. Discover quality products, 
            build your business, and join thousands of satisfied customers in our thriving marketplace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors text-lg font-semibold shadow-lg"
            >
              {userProfile ? 'Browse Marketplace' : 'Get Started'}
            </button>
            
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-lg font-semibold"
            >
              Explore Products
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for products, sellers, or categories..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/marketplace');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">10,000+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">5,000+</p>
              <p className="text-gray-600">Products Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">1,000+</p>
              <p className="text-gray-600">Verified Sellers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600 mb-2">50,000+</p>
              <p className="text-gray-600">Orders Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful sellers on Ready9ja. Start your online business today 
            and reach customers across Nigeria.
          </p>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold shadow-lg"
          >
            Start Selling Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;