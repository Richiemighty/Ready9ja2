import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface MobileProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: string) => void;
  onChat?: (sellerId: string, productId: string) => void;
  isFavorite?: boolean;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  onToggleFavorite,
  onChat,
  isFavorite = false
}) => {
  const { addToCart } = useCart();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      console.log('Product added to cart:', product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product.id);
  };

  const handleChat = () => {
    onChat?.(product.sellerId, product.id);
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={16} 
            color={isFavorite ? '#ef4444' : '#6b7280'} 
          />
        </TouchableOpacity>

        {/* Stock Status */}
        <View style={styles.stockBadge}>
          <Text style={[
            styles.stockText,
            product.available && product.stock > 0 ? styles.stockTextGreen : styles.stockTextRed
          ]}>
            {product.available && product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        {/* Price and Rating */}
        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>
            {formatPrice(product.price, product.currency)}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text style={styles.rating}>
              {product.sellerRating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Seller Info and Actions */}
        <View style={styles.bottomContainer}>
          <View style={styles.sellerContainer}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {product.sellerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.sellerName} numberOfLines={1}>
              {product.sellerName}
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleChat}
              style={styles.chatButton}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!product.available || product.stock === 0}
              style={[
                styles.cartButton,
                (!product.available || product.stock === 0) && styles.cartButtonDisabled
              ]}
            >
              <Ionicons name="bag-add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '500',
  },
  stockTextGreen: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  stockTextRed: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  detailsContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 18,
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 2,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 24,
    height: 24,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sellerAvatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  sellerName: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 14,
  },
  cartButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 14,
  },
  cartButtonDisabled: {
    opacity: 0.5,
  },
});

export default MobileProductCard;