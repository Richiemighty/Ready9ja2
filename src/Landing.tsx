import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./contexts/AuthContext";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { currentUser, userProfile } = useAuth();
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  // Redirect if user is already signed in
  useEffect(() => {
    if (currentUser && userProfile) {
      if (userProfile.role === 'buyer') {
        navigation.navigate('BuyerTabs' as never);
      } else if (userProfile.role === 'seller') {
        navigation.navigate('SellerDashboard' as never);
      } else if (userProfile.role === 'admin') {
        navigation.navigate('AdminDashboard' as never);
      }
    }
  }, [currentUser, userProfile, navigation]);

  // Show login/register after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {!showLogin ? (
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Ionicons name="storefront" size={80} color="#fbbf24" />
          <Text style={styles.logoText}>
            <Text style={styles.logoTextWhite}>Ready</Text>
            <Text style={styles.logoTextYellow}>9ja</Text>
          </Text>
          <Text style={styles.tagline}>Your Trusted Marketplace</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.loginContainer, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeTitle}>Welcome to Ready9ja</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Auth' as never, { mode: 'signin' } as never)}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Auth' as never, { mode: 'signup' } as never)}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.poweredBy}>
            Powered by <Text style={styles.brandText}>Ready9ja</Text>
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
  },
  logoTextWhite: {
    color: 'white',
  },
  logoTextYellow: {
    color: '#fbbf24',
  },
  tagline: {
    fontSize: 14,
    color: '#e5e7eb',
    marginTop: 8,
    fontWeight: '300',
    letterSpacing: 1,
  },
  loginContainer: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
  },
  poweredBy: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 24,
    textAlign: 'center',
  },
  brandText: {
    fontWeight: '600',
    color: '#7c3aed',
  },
});

export default Landing;