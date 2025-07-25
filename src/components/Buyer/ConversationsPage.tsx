import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Search, 
  Send,
  Image,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  productId: string;
  productName: string;
  productImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
}

const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      sellerId: 'seller1',
      sellerName: 'Farm Fresh Lagos',
      sellerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      productId: 'prod1',
      productName: 'Fresh Tomatoes (1kg)',
      productImage: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      lastMessage: 'The tomatoes are very fresh, harvested this morning!',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      sellerId: 'seller2',
      sellerName: 'Tech Hub Nigeria',
      sellerAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg',
      productId: 'prod2',
      productName: 'Samsung Galaxy Earbuds',
      productImage: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
      lastMessage: 'Yes, we have warranty for 1 year',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      sellerId: 'seller3',
      sellerName: 'Fashion Forward',
      sellerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      productId: 'prod3',
      productName: 'Designer Handbag',
      productImage: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      lastMessage: 'Thank you for your order! 😊',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'buyer',
      content: 'Hi, are these tomatoes fresh?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'seller1',
      content: 'Yes, they are very fresh! Harvested this morning from our farm.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      senderId: 'seller1',
      content: 'The tomatoes are very fresh, harvested this morning!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    },
    {
      id: '4',
      senderId: 'buyer',
      content: 'Great! Can you send me a picture of the current batch?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'text'
    }
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      // Add message sending logic here
      setMessageInput('');
    }
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div
      onClick={() => setSelectedConversation(conversation.id)}
      className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="relative">
        <img
          src={conversation.sellerAvatar}
          alt={conversation.sellerName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-semibold text-gray-900 truncate">{conversation.sellerName}</p>
          <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-1 truncate">{conversation.productName}</p>
        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
      </div>
      
      {conversation.unreadCount > 0 && (
        <div className="ml-2 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  );

  const ChatInterface = ({ conversationId }: { conversationId: string }) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <img
                  src={conversation.sellerAvatar}
                  alt={conversation.sellerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">{conversation.sellerName}</p>
                <p className="text-xs text-gray-600">
                  {conversation.isOnline ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Product Context */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img
                src={conversation.productImage}
                alt={conversation.productName}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{conversation.productName}</p>
                <p className="text-xs text-gray-600">Product discussion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === 'buyer'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'buyer' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Image className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedConversation) {
    return (
      <div className="pb-20 bg-gray-50 h-screen">
        <ChatInterface conversationId={selectedConversation} />
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Messages</h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white">
        {conversations.length > 0 ? (
          conversations.map(conversation => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No conversations yet</h2>
            <p className="text-gray-600 text-center mb-8">
              Start chatting with sellers to get product information and support.
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;