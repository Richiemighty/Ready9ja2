import React from 'react';
import { Product } from '../../types';
import { Heart, MessageCircle, Star, ShoppingCart, MapPin } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform">
      <div className="flex p-3 space-x-3">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          
          {/* Stock Status */}
          <div className="absolute -top-1 -right-1">
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
              product.available && product.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.available && product.stock > 0 ? product.stock : 'Out'}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
              {product.name}
            </h3>
            <button
              onClick={handleToggleFavorite}
              className="p-1 ml-2 flex-shrink-0"
            >
              <Heart 
                className={`w-4 h-4 ${
                  isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                }`} 
              />
            </button>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-purple-600">
              {formatPrice(product.price, product.currency)}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">
                {product.sellerRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {product.sellerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-700 truncate">{product.sellerName}</span>
            </div>

            <div className="flex items-center space-x-1">
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
  );
};

export default MobileProductCard;