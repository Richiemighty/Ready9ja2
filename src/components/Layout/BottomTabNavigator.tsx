import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BuyerDashboard from '../Buyer/BuyerDashboard';
import MobileMarketplace from '../Marketplace/MobileMarketplace';
import CartPage from '../Buyer/CartPage';
import ProfilePage from '../Buyer/ProfilePage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={BuyerDashboard} />
      <Tab.Screen name="Browse" component={MobileMarketplace} />
      <Tab.Screen name="Cart" component={CartPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;