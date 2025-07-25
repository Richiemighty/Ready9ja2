import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle,
  Clock,
  CheckCircle,
  User
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface OrderStatus {
  id: string;
  status: string;
  message: string;
  timestamp: Date;
  completed: boolean;
}

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentStatus, setCurrentStatus] = useState('in_transit');

  const orderDetails = {
    id: orderId || 'ORD-2025-001',
    trackingCode: 'VEN-20250118-001',
    totalAmount: 47500,
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    items: [
      {
        name: 'Fresh Tomatoes (1kg)',
        quantity: 2,
        price: 1500,
        image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg'
      },
      {
        name: 'Samsung Galaxy Earbuds',
        quantity: 1,
        price: 45000,
        image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg'
      }
    ],
    seller: {
      name: 'Farm Fresh Lagos',
      phone: '+234 801 234 5678'
    },
    rider: {
      name: 'John Adebayo',
      phone: '+234 802 345 6789',
      vehicle: 'Honda CG 125 - ABC 123 XY'
    },
    deliveryAddress: '15 Admiralty Way, Lekki Phase 1, Lagos'
  };

  const statusSteps: OrderStatus[] = [
    {
      id: '1',
      status: 'pending',
      message: 'Order placed successfully',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      completed: true
    },
    {
      id: '2',
      status: 'payment_verified',
      message: 'Payment confirmed',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      completed: true
    },
    {
      id: '3',
      status: 'rider_assigned',
      message: 'Rider assigned and heading to pickup',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      completed: true
    },
    {
      id: '4',
      status: 'picked_up',
      message: 'Order picked up from seller',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      completed: true
    },
    {
      id: '5',
      status: 'in_transit',
      message: 'On the way to your location',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      completed: true
    },
    {
      id: '6',
      status: 'delivered',
      message: 'Order delivered successfully',
      timestamp: new Date(),
      completed: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

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
          <div className="ml-2">
            <h1 className="text-lg font-semibold text-gray-900">Order Tracking</h1>
            <p className="text-sm text-gray-600">{orderDetails.trackingCode}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Current Status Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Truck className="w-6 h-6 mr-2" />
              <span className="font-semibold">On the way</span>
            </div>
            <span className="text-sm opacity-90">
              ETA: {formatTime(orderDetails.estimatedDelivery)}
            </span>
          </div>
          <p className="text-sm opacity-90 mb-3">
            Your order is being delivered to your location
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">{orderDetails.rider.name}</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white bg-opacity-20 rounded-full">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs opacity-75 mt-1">{orderDetails.rider.vehicle}</p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
          
          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status, step.completed)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      step.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {step.completed ? formatTime(step.timestamp) : ''}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`w-px h-6 ml-2.5 mt-2 ${
                      step.completed ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                <p className="text-sm text-gray-600">{orderDetails.deliveryAddress}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Contact</p>
                <p className="text-sm text-gray-600">+234 801 234 5678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          
          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-purple-600">
                {formatPrice(orderDetails.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center py-3 bg-blue-600 text-white rounded-xl font-medium">
            <Phone className="w-5 h-5 mr-2" />
            Call Rider
          </button>
          <button className="flex items-center justify-center py-3 bg-green-600 text-white rounded-xl font-medium">
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;