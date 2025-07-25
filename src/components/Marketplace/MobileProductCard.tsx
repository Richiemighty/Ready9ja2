import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface MobileProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  onChat?: (sellerId: string, productId: string) => void;
  isFavorite?: boolean;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onChat,
  isFavorite = false
}) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChat?.(product.sellerId, product.id);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full backdrop-blur-sm"
          >
            <Heart 
              className={`w-4 h-4 ${
                isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
              }`} 
            />
          </button>

          {/* Stock Status */}
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.available && product.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.available && product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 flex flex-col flex-grow">
          <div className="mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {product.category}
            </p>
          </div>

          {/* Price and Rating */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold text-purple-600">
                {formatPrice(product.price, product.currency)}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-gray-700">
                  {product.sellerRating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Seller Info and Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {product.sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-700 truncate max-w-[80px]">
                  {product.sellerName}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleChat}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available || product.stock === 0}
                  className="p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProductCard;