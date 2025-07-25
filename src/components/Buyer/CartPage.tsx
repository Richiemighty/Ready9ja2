import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  sellerId: string;
  sellerName: string;
  stock: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'prod1',
      name: 'Fresh Tomatoes (1kg)',
      price: 1500,
      currency: 'NGN',
      image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      quantity: 2,
      sellerId: 'seller1',
      sellerName: 'Farm Fresh Lagos',
      stock: 50
    },
    {
      id: '2',
      productId: 'prod2',
      name: 'Samsung Galaxy Earbuds',
      price: 45000,
      currency: 'NGN',
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
      quantity: 1,
      sellerId: 'seller2',
      sellerName: 'Tech Hub Nigeria',
      stock: 10
    }
  ]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const CartItemCard = ({ item }: { item: CartItem }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex space-x-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2">by {item.sellerName}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-600">
              {formatPrice(item.price, item.currency)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {item.stock} available
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Shopping Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-36 bg-gray-50 min-h-screen">
      {/* ↑↑ increased from pb-24 to pb-36 to avoid overlap with MobileBottomNav */}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-2">Shopping Cart</h1>
          </div>
          <span className="text-sm text-gray-600">{totalItems} items</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-3">
        {cartItems.map(item => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({totalItems} items)</span>
              <span className="font-medium">{formatPrice(totalAmount, 'NGN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">₦500</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-purple-600">
                  {formatPrice(totalAmount + 500, 'NGN')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Delivery to Lagos, Nigeria</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-purple-600">
              {formatPrice(totalAmount + 500, 'NGN')}
            </p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Proceed to Checkout
          </button>
        </div>
      </div>


      
    </div>
  );
};

export default CartPage;
