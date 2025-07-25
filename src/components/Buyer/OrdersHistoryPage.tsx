import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Star,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  trackingCode: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  totalAmount: number;
  orderDate: Date;
  items: {
    name: string;
    quantity: number;
    image: string;
  }[];
  seller: string;
}

const OrdersHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const orders: Order[] = [
    {
      id: 'ORD-2025-001',
      trackingCode: 'VEN-20250118-001',
      status: 'in_transit',
      totalAmount: 47500,
      orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      items: [
        { name: 'Fresh Tomatoes (1kg)', quantity: 2, image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg' },
        { name: 'Samsung Galaxy Earbuds', quantity: 1, image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg' }
      ],
      seller: 'Farm Fresh Lagos'
    },
    {
      id: 'ORD-2025-002',
      trackingCode: 'VEN-20250117-002',
      status: 'delivered',
      totalAmount: 25000,
      orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      items: [
        { name: 'Nike Air Force 1', quantity: 1, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg' }
      ],
      seller: 'Sneaker Hub NG'
    },
    {
      id: 'ORD-2025-003',
      trackingCode: 'VEN-20250116-003',
      status: 'delivered',
      totalAmount: 8500,
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      items: [
        { name: 'Organic Honey (500ml)', quantity: 2, image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg' }
      ],
      seller: 'Natural Farms'
    },
    {
      id: 'ORD-2025-004',
      trackingCode: 'VEN-20250115-004',
      status: 'cancelled',
      totalAmount: 15000,
      orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      items: [
        { name: 'Bluetooth Speaker', quantity: 1, image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg' }
      ],
      seller: 'Tech World'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'in_transit', label: 'In Transit', count: orders.filter(o => o.status === 'in_transit').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_transit':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{order.trackingCode}</p>
          <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
        </div>
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt={item.name}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
          {order.items.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">+{order.items.length - 3}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-600">from {order.seller}</p>
        </div>
        <span className="font-bold text-purple-600">
          {formatPrice(order.totalAmount)}
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/order-tracking/${order.id}`)}
          className="flex-1 flex items-center justify-center py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
        
        {order.status === 'delivered' && (
          <button className="flex items-center justify-center px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg text-sm font-medium">
            <Star className="w-4 h-4 mr-1" />
            Review
          </button>
        )}
        
        {order.status === 'delivered' && (
          <button className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reorder
          </button>
        )}
      </div>
    </div>
  );

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
          <h1 className="text-lg font-semibold text-gray-900 ml-2">My Orders</h1>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4">
        {filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600 text-center mb-8">
              {activeTab === 'all' 
                ? "You haven't placed any orders yet."
                : `No ${activeTab.replace('_', ' ')} orders found.`
              }
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistoryPage;