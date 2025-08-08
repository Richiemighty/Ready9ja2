import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import Landing from './src/Landing';
import MobileAuthForm from './src/components/Auth/MobileAuthForm';
import MobileMarketplace from './src/components/Marketplace/MobileMarketplace';
import MobileProductDetails from './src/components/Products/MobileProductDetails';
import MobileSellerDashboard from './src/components/Seller/MobileSellerDashboard';
import AdminDashboard from './src/components/Admin/AdminDashboard';
import BuyerDashboard from './src/components/Buyer/BuyerDashboard';
import CartPage from './src/components/Buyer/CartPage';
import CheckoutPage from './src/components/Buyer/CheckoutPage';
import OrderTrackingPage from './src/components/Buyer/OrderTrackingPage';
import OrdersHistoryPage from './src/components/Buyer/OrdersHistoryPage';
import ConversationsPage from './src/components/Buyer/ConversationsPage';
import ReferralsPage from './src/components/Buyer/ReferralsPage';
import ProfilePage from './src/components/Buyer/ProfilePage';
import BottomTabNavigator from './src/components/Layout/BottomTabNavigator';

const Stack = createNativeStackNavigator();

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('buyer' | 'seller' | 'admin')[] 
}> = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading component here
  }

  if (!currentUser) {
    return <MobileAuthForm />;
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Landing />;
  }

  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  const { userProfile, currentUser, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading component here
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Public Routes */}
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Auth" component={MobileAuthForm} />
        <Stack.Screen name="Marketplace" component={MobileMarketplace} />
        <Stack.Screen name="ProductDetails" component={MobileProductDetails} />

        {/* Protected Routes */}
        <Stack.Screen name="SellerDashboard">
          {() => (
            <ProtectedRoute allowedRoles={['seller']}>
              <MobileSellerDashboard />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="AdminDashboard">
          {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        {/* Buyer Routes with Bottom Tab Navigation */}
        <Stack.Screen name="BuyerTabs">
          {() => (
            <ProtectedRoute allowedRoles={['buyer']}>
              <BottomTabNavigator />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Cart">
          {() => (
            <ProtectedRoute allowedRoles={['buyer']}>
              <CartPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Checkout">
          {() => (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="OrderTracking">
          {() => (
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Orders">
          {() => (
            <ProtectedRoute>
              <OrdersHistoryPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Messages">
          {() => (
            <ProtectedRoute>
              <ConversationsPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Referrals">
          {() => (
            <ProtectedRoute>
              <ReferralsPage />
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {() => (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

// Main App Wrapper
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;