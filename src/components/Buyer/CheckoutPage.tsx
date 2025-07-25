import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Shield,
  Truck,
  User,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [deliveryType, setDeliveryType] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: userProfile?.displayName || '',
    phone: userProfile?.phoneNumber || '',
    address: userProfile?.address || '',
    instructions: ''
  });

  const orderTotal = 47000; // This would come from cart context
  const deliveryFee = deliveryType === 'express' ? 1500 : 500;
  const finalTotal = orderTotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      navigate('/order-tracking/ORD-2025-001');
    }, 2000);
  };

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '2-3 business days',
      price: 500,
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      time: 'Same day delivery',
      price: 1500,
      icon: Clock
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Visa, Mastercard, Verve',
      icon: CreditCard
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Shield
    }
  ];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Checkout</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Delivery Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Delivery Information</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                name="address"
                value={deliveryInfo.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Enter your complete delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="instructions"
                value={deliveryInfo.instructions}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="Any special instructions for delivery"
              />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Options</h3>
          
          <div className="space-y-3">
            {deliveryOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  deliveryType === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value={option.id}
                  checked={deliveryType === option.id}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="sr-only"
                />
                <option.icon className={`w-5 h-5 mr-3 ${
                  deliveryType === option.id ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      deliveryType === option.id ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {option.name}
                    </span>
                    <span className="font-semibold text-purple-600">
                      {formatPrice(option.price)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{option.time}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <method.icon className={`w-5 h-5 mr-3 ${
                  paymentMethod === method.id ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <div>
                  <div className={`font-medium ${
                    paymentMethod === method.id ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    {method.name}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(orderTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-purple-600">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address}
          className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Shield className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Processing...' : `Pay ${formatPrice(finalTotal)}`}
        </button>
        
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <Shield className="w-3 h-3 mr-1" />
          Secured by 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;