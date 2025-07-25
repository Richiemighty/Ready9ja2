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
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useProducts, useProductOperations } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from './ProductForm';

const MobileSellerDashboard: React.FC = () => {
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

  const StatCard = ({ icon: Icon, title, value, change, color = 'purple' }: any) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.startsWith('+') ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex space-x-3">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
            <div className="relative">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-purple-600">
              {formatCurrency(product.price)}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              product.available && product.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock} left
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <button 
              onClick={() => handleEditProduct(product)}
              className="flex-1 py-1.5 px-3 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium"
            >
              Edit
            </button>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              disabled={operationLoading}
              className="flex-1 py-1.5 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={() => {
          // Products will be automatically updated via the real-time listener
        }}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-1">Seller Dashboard</h1>
          <p className="text-purple-100 text-sm">Manage your store and track sales</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={Package}
            title="Products"
            value={stats.totalProducts}
            change="+2"
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Orders"
            value={stats.totalOrders}
            change="+12%"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change="+8%"
            color="purple"
          />
          <StatCard
            icon={Star}
            title="Rating"
            value={stats.averageRating.toFixed(1)}
            color="yellow"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsProductFormOpen(true)}
              className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-medium text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
            <button className="flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm">
              <Eye className="w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Products</h2>
            <button 
              onClick={() => setIsProductFormOpen(true)}
              className="text-purple-600 text-sm font-medium"
            >
              Add New
            </button>
          </div>
          
          <div className="p-4">
            {productsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 5).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {products.length > 5 && (
                  <button className="w-full py-2 text-purple-600 text-sm font-medium">
                    View All Products ({products.length})
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">No products yet</h3>
                <p className="text-gray-600 text-sm mb-4">Start by adding your first product</p>
                <button 
                  onClick={() => setIsProductFormOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-sm font-medium"
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSellerDashboard;