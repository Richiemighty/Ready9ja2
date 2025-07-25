import React, { useState } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileProductCard from './MobileProductCard';
import { useProducts } from '../../hooks/useProducts';

const MobileMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
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
    return matchesCategory;
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
      <div className="pb-20">
        <div className="px-4 py-4">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-20 px-4 py-8">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[120px] z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-900">Browse Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
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
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          {sortedProducts.length} products found
        </p>
      </div>

      {/* Products List */}
      <div className="px-4 py-2 space-y-3">
        {sortedProducts.map(product => (
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

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileMarketplace;