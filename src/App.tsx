import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// import MobileHeader from './components/Layout/MobileHeader';
import MobileBottomNav from './components/Layout/MobileBottomNav';
import MobileHero from './components/Home/MobileHero';
import MobileAuthForm from './components/Auth/MobileAuthForm';
import MobileMarketplace from './components/Marketplace/MobileMarketplace';
import MobileProductDetails from './components/Products/MobileProductDetails';
import MobileSellerDashboard from './components/Seller/MobileSellerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import BuyerDashboard from './components/Buyer/BuyerDashboard';
import CartPage from './components/Buyer/CartPage';
import CheckoutPage from './components/Buyer/CheckoutPage';
import OrderTrackingPage from './components/Buyer/OrderTrackingPage';
import OrdersHistoryPage from './components/Buyer/OrdersHistoryPage';
import ConversationsPage from './components/Buyer/ConversationsPage';
import ReferralsPage from './components/Buyer/ReferralsPage';
import ProfilePage from './components/Buyer/ProfilePage';
import Landing from "./Landing";
import { CartProvider } from './contexts/CartContext';


// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('buyer' | 'seller' | 'admin')[] 
}> = ({ children, allowedRoles }) => {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth?mode=signin" replace />;
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  const { userProfile, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        <Route 
          path="/dashboard" 
          element={
            currentUser && userProfile?.role === 'buyer' ? (
              <Navigate to="/buyer/dashboard" replace />
            ) : currentUser && userProfile?.role === 'seller' ? (
              <Navigate to="/seller/dashboard" replace />
            ) : <MobileHero />
          } 
        />
        <Route path="/auth" element={<MobileAuthForm />} />
        <Route path="/marketplace" element={<MobileMarketplace />} />
        <Route path="/product/:id" element={<MobileProductDetails />} />

        {/* Protected Routes */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <MobileSellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={['buyer']}><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={['buyer']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersHistoryPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><ConversationsPage /></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><ReferralsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/favorites" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <div className="pb-20 p-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Favorites</h1>
                <p className="text-gray-600">Favorites functionality coming soon...</p>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Only show MobileBottomNav if signed in */}
      {currentUser && <MobileBottomNav />}
    </div>
  );
};


// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;