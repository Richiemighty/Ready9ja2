import React from 'react';
import { Home, Search, ShoppingBag, Heart, User, Store, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Home', path: '/', key: 'home' },
      { icon: Search, label: 'Browse', path: '/marketplace', key: 'marketplace' },
    ];

    if (!userProfile) {
      return [
        ...baseItems,
        { icon: User, label: 'Sign In', path: '/auth?mode=signin', key: 'auth' }
      ];
    }

    switch (userProfile.role) {
      case 'buyer':
        return [
          ...baseItems,
          { icon: ShoppingBag, label: 'Cart', path: '/cart', key: 'cart' },
          { icon: Heart, label: 'Favorites', path: '/favorites', key: 'favorites' },
          { icon: User, label: 'Profile', path: '/profile', key: 'profile' }
        ];
      case 'seller':
        return [
          ...baseItems,
          { icon: Store, label: 'My Store', path: '/seller/dashboard', key: 'store' },
          { icon: User, label: 'Profile', path: '/profile', key: 'profile' }
        ];
      case 'admin':
        return [
          ...baseItems,
          { icon: Settings, label: 'Admin', path: '/admin', key: 'admin' },
          { icon: User, label: 'Profile', path: '/profile', key: 'profile' }
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive(item.path)
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;