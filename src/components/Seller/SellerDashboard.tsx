import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  Users, 
  Eye,
  Edit,
  Trash2,
  Star,
  MessageCircle 
} from 'lucide-react';
import { useProducts, useProductOperations } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from './ProductForm';

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { userProfile } = useAuth();
  const { products, loading: productsLoading } = useProducts(userProfile?.id);
  const { orders, loading: ordersLoading } = useOrders();
  const { deleteProduct, loading: operationLoading } = useProductOperations();
  

  // Calculate stats from real data
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0),
    averageRating: products.length > 0 
      ? products.reduce((sum, product) => sum + product.sellerRating, 0) / products.length 
      : 0
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleProductFormClose = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const StatCard = ({ icon: Icon, title, value, change }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-full">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-500 font-medium">{change}</span>
        </div>
      )}
    </div>
  );

  const ProductRow = ({ product }: { product: any }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.category}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-lg font-bold text-purple-600">
                {formatCurrency(product.price)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.available && product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock} in stock
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleEditProduct(product)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteProduct(product.id)}
            disabled={operationLoading}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={handleProductFormClose}
        product={editingProduct}
        onSuccess={() => {
          // Products will be automatically updated via the real-time listener
        }}
      />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your products and track your sales</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Package}
              title="Total Products"
              value={stats.totalProducts}
              change="+2 this month"
            />
            <StatCard
              icon={Users}
              title="Total Orders"
              value={stats.totalOrders}
              change="+12% from last month"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              change="+8% from last month"
            />
            <StatCard
              icon={Star}
              title="Average Rating"
              value={stats.averageRating}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={() => setIsProductFormOpen(true)}
                className="flex items-center p-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors"
              >
                <Plus className="w-5 h-5 mr-3" />
                Add New Product
              </button>
              <button className="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="w-5 h-5 mr-3" />
                View Analytics
              </button>
              <button className="flex items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <MessageCircle className="w-5 h-5 mr-3" />
                Check Messages
              </button>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Products</h2>
              <button
                onClick={() => setActiveTab('products')}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {productsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                products.slice(0, 3).map(product => (
                  <ProductRow key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
            <button 
              onClick={() => setIsProductFormOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              products.map(product => (
                <ProductRow key={product.id} product={product} />
              ))
            )}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first product</p>
              <button 
                onClick={() => setIsProductFormOpen(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Other tabs content would go here */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Orders</h2>
          <p className="text-gray-600">Order management functionality coming soon...</p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <p className="text-gray-600">Message management functionality coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;