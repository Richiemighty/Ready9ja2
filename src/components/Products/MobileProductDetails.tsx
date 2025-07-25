import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Star, 
  ShoppingCart, 
  Share2,
  Plus,
  Minus,
  Shield,
  Truck,
  Clock
} from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../contexts/AuthContext';

const MobileProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { product, loading, error } = useProduct(id!);
  const { reviews } = useReviews(id);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (loading) {
    return (
      <div className="pb-20">
        <div className="animate-pulse">
          <div className="h-80 bg-gray-200"></div>
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pb-20 px-4 py-8 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 text-sm mb-4">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', product.id, quantity);
  };

  const handleChatWithSeller = () => {
    console.log('Chat with seller:', product.sellerId);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-gray-900 text-center flex-1 mx-4 truncate">
            {product.name}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="relative">
        <div className="aspect-square bg-white">
          <img
            src={product.images[selectedImageIndex] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Image Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.available && product.stock > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.available && product.stock > 0 
              ? `${product.stock} in stock` 
              : 'Out of stock'
            }
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white">
        <div className="p-4">
          {/* Title and Price */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(product.price, product.currency)}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {averageRating.toFixed(1)} ({reviews.length})
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className={`text-gray-700 text-sm leading-relaxed ${
              !showFullDescription ? 'line-clamp-3' : ''
            }`}>
              {product.description}
            </p>
            {product.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-purple-600 text-sm font-medium mt-1"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Secure</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-600">Fast Delivery</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white mt-2">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {product.sellerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{product.sellerName}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {product.sellerRating.toFixed(1)} seller rating
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleChatWithSeller}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white mt-2">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Reviews ({reviews.length})</h3>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {review.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
              {reviews.length > 3 && (
                <button className="text-purple-600 text-sm font-medium">
                  View all reviews
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No reviews yet</p>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      {userProfile?.role === 'buyer' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.available || product.stock === 0}
              className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProductDetails;