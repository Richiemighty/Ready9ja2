import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MobileAuthForm: React.FC = () => {
  const route = useRoute();
  const params = route.params as { mode?: string; redirect?: string } || {};
  const initialMode = params.mode || 'signin';
  const redirect = params.redirect || 'BuyerTabs';
  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'buyer' as 'buyer' | 'seller' | 'admin',
    phoneNumber: '',
    address: '',
    businessName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser, userProfile, signIn, signUp } = useAuth();
  const navigation = useNavigation();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      console.log('Redirecting to:', redirect);
      navigation.navigate(redirect as never);
    }
  }, [currentUser, userProfile, navigation, redirect]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          displayName: formData.displayName,
          role: formData.role,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          businessName: formData.businessName
        });
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      Alert.alert('Error', err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'buyer', label: 'Buyer', icon: 'person', description: 'Purchase products' },
    { value: 'seller', label: 'Seller', icon: 'storefront', description: 'Sell your products' },
    { value: 'admin', label: 'Admin', icon: 'shield', description: 'Manage platform' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isSignIn ? 'Welcome back' : 'Create Account'}
        </Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Ionicons name="storefront" size={32} color="white" />
        </View>
        <Text style={styles.logoSubtitle}>
          {isSignIn
            ? 'Sign in to your account'
            : 'Join thousands of users on Ready9ja'}
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Specific Fields */}
        {!isSignIn && (
          <>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.displayName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
                placeholder="Enter your full name"
              />
            </View>

            {/* Role */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      formData.role === role.value && styles.roleOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, role: role.value as any }))}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={20}
                      color={formData.role === role.value ? '#7c3aed' : '#6b7280'}
                    />
                    <View style={styles.roleText}>
                      <Text style={[
                        styles.roleLabel,
                        formData.role === role.value && styles.roleLabelSelected
                      ]}>
                        {role.label}
                      </Text>
                      <Text style={styles.roleDescription}>{role.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            {/* Business Name (only for sellers) */}
            {formData.role === 'seller' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.businessName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                  placeholder="Enter your business name"
                />
              </View>
            )}
          </>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isSignIn ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Toggle Mode */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setIsSignIn(!isSignIn)}
        >
          <Text style={styles.toggleText}>
            {isSignIn
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    padding: 12,
  },
  roleContainer: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
  },
  roleOptionSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f3f4f6',
  },
  roleText: {
    marginLeft: 12,
    flex: 1,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  roleLabelSelected: {
    color: '#7c3aed',
  },
  roleDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    color: '#7c3aed',
  },
});

export default MobileAuthForm;