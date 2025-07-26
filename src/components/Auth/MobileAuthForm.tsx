// src/components/Auth/MobileAuthForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Store, Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const MobileAuthForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'signin';
  const redirect = searchParams.get('redirect') || '/dashboard';
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
  const [error, setError] = useState('');

  const { currentUser, userProfile, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      console.log('Redirecting to:', redirect);
      navigate(redirect, { replace: true });
    }
  }, [currentUser, userProfile, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const roles = [
    { value: 'buyer', label: 'Buyer', icon: User, description: 'Purchase products' },
    { value: 'seller', label: 'Seller', icon: Store, description: 'Sell your products' },
    { value: 'admin', label: 'Admin', icon: Shield, description: 'Manage platform' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">
            {isSignIn ? 'Welcome back' : 'Create Account'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Store className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 text-sm">
              {isSignIn
                ? 'Sign in to your account'
                : 'Join thousands of users on Ready9ja'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign Up Specific Fields */}
            {!isSignIn && (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                          formData.role === role.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <role.icon
                          className={`w-5 h-5 mr-3 ${
                            formData.role === role.value ? 'text-purple-600' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <div className={`font-medium text-sm ${
                            formData.role === role.value ? 'text-purple-900' : 'text-gray-900'
                          }`}>
                            {role.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {role.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Business Name (only for sellers) */}
                {formData.role === 'seller' && (
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your business name"
                      required={formData.role === 'seller'}
                    />
                  </div>
                )}
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
              }}
              className="text-sm text-purple-600 hover:text-purple-800 transition"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAuthForm;