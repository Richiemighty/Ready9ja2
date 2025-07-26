import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, Search, ShoppingCart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileProductCard from './MobileProductCard';
import { useProducts } from '../../hooks/useProducts';

const MobileMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { products, loading, error } = useProducts();

  const categories = [
    'all',
    'Food & Agriculture',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Fitness'
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.sellerRating - a.sellerRating;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (loading) {
    return (
      <div className="pb-20 pt-16">
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-white rounded-xl p-3 shadow-sm h-64"
              >
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-20 pt-16 px-4 py-8"
      >
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm"
      >
        {/* Marketplace Page Title */}
      <div className="px-4 pt-4 pb-2 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-sm text-gray-500">Browse and discover amazing products</p>
      </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Browse Products</h1>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-purple-600"
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-2">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'all' ? 'All' : category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 overflow-hidden border-t border-gray-100"
            >
              <div className="py-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="inStock" 
                    className="rounded text-purple-600 mr-2" 
                  />
                  <label htmlFor="inStock" className="text-sm text-gray-700">
                    In Stock Only
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <p className="text-xs text-gray-500">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Products Grid */}
      <div className="px-3 py-3">
        {sortedProducts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer"
              >
                <MobileProductCard
                  product={product}
                  // onAddToCart={(product) => console.log('Add to cart:', product)}
                  onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
                  onChat={(sellerId, productId) => console.log('Chat with seller:', sellerId, productId)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-sm mb-4">Try adjusting your search or filters</p>
            <motion.button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSortBy('newest');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Floating Cart Button */}
      <motion.div 
        className="fixed bottom-20 right-4 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => navigate('/cart')}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default MobileMarketplace;