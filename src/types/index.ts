export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'seller' | 'admin';
  phoneNumber?: string;
  address?: string;
  businessName?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'USD';
  category: string;
  images: string[];
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  currency: 'NGN' | 'USD';
  status: 'pending' | 'payment_verified' | 'rider_assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  buyerPhone: string;
  buyerName: string;
  verificationCode: string;
  riderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}