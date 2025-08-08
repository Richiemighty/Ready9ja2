import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import MobileProductCard from '../Marketplace/MobileProductCard';

const BuyerDashboard: React.FC = () => {
  const navigation = useNavigation();
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
    { icon: 'bag', label: 'My Cart', path: 'Cart', color: '#3b82f6' },
    { icon: 'heart', label: 'Favorites', path: 'Favorites', color: '#ef4444' },
    { icon: 'time', label: 'Orders', path: 'Orders', color: '#10b981' },
    { icon: 'gift', label: 'Referrals', path: 'Referrals', color: '#8b5cf6' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, {userProfile?.displayName?.split(' ')[0]}! 👋
          </Text>
          <Text style={styles.welcomeSubtext}>Discover amazing products today</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userProfile?.displayName?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor="#6b7280"
            onFocus={() => navigation.navigate('Browse' as never)}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionItem}
                onPress={() => navigation.navigate(action.path as never)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemSelected
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Browse' as never)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.map(product => (
              <View key={product.id} style={styles.productCardContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetails' as never, { id: product.id } as never)}
                >
                  <MobileProductCard
                    product={product}
                    onToggleFavorite={(productId) => console.log('Toggle favorite:', productId)}
                    onChat={(sellerId, productId) => console.log('Chat with seller:', sellerId, productId)}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Trending Section */}
      <View style={styles.section}>
        <View style={styles.trendingCard}>
          <View style={styles.trendingHeader}>
            <Ionicons name="trending-up" size={20} color="white" />
            <Text style={styles.trendingTitle}>Trending Now</Text>
          </View>
          <Text style={styles.trendingSubtext}>
            Don't miss out on the hottest products this week!
          </Text>
          <TouchableOpacity
            style={styles.trendingButton}
            onPress={() => navigation.navigate('Browse' as never)}
          >
            <Text style={styles.trendingButtonText}>Explore Trending</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Referral Banner */}
      <View style={styles.section}>
        <View style={styles.referralCard}>
          <View style={styles.referralContent}>
            <View>
              <Text style={styles.referralTitle}>Earn with Referrals</Text>
              <Text style={styles.referralSubtext}>Invite friends and earn bonuses!</Text>
            </View>
            <Ionicons name="gift" size={32} color="white" style={styles.referralIcon} />
          </View>
          <TouchableOpacity
            style={styles.referralButton}
            onPress={() => navigation.navigate('Referrals' as never)}
          >
            <Text style={styles.referralButtonText}>Start Earning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#c4b5fd',
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginTop: -16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '500',
  },
  quickActionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  categoriesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    minWidth: 80,
  },
  categoryItemSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f3f4f6',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  categoryLabelSelected: {
    color: '#7c3aed',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  trendingCard: {
    backgroundColor: '#f97316',
    borderRadius: 16,
    padding: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  trendingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  trendingButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trendingButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f97316',
  },
  referralCard: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 16,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  referralSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  referralIcon: {
    opacity: 0.8,
  },
  referralButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  referralButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
});

export default BuyerDashboard;