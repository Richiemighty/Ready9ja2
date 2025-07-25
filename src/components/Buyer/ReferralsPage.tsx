import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Gift, 
  Share2, 
  Copy, 
  Users, 
  Coins,
  Trophy,
  Star,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = 'READY9JA-USER123';
  const referralLink = `https://ready9ja.com/join?ref=${referralCode}`;
  
  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 15000,
    pendingEarnings: 3500
  };

  const recentReferrals = [
    {
      id: '1',
      name: 'John Adebayo',
      joinDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'active',
      earnings: 2000
    },
    {
      id: '2',
      name: 'Sarah Okafor',
      joinDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'active',
      earnings: 1500
    },
    {
      id: '3',
      name: 'Michael Eze',
      joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      earnings: 0
    }
  ];

  const rewards = [
    {
      level: 'Bronze',
      referrals: 5,
      bonus: 1000,
      achieved: true
    },
    {
      level: 'Silver',
      referrals: 10,
      bonus: 2500,
      achieved: true
    },
    {
      level: 'Gold',
      referrals: 25,
      bonus: 5000,
      achieved: false
    },
    {
      level: 'Platinum',
      referrals: 50,
      bonus: 10000,
      achieved: false
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Ready9ja Marketplace',
        text: 'Join me on Ready9ja and start buying/selling amazing products!',
        url: referralLink
      });
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold ml-2">Referrals & Rewards</h1>
        </div>

        <div className="px-4 pb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Earn with Every Referral</h2>
            <p className="text-purple-100 text-sm">
              Invite friends and earn ₦2,000 for each successful referral!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              <p className="text-sm opacity-90">Total Referrals</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <Coins className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</p>
              <p className="text-sm opacity-90">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 -mt-4 relative z-10">
        {/* Referral Link Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Your Referral Link</h3>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 mb-2">Referral Code</p>
            <p className="font-mono text-purple-600 font-semibold">{referralCode}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 mb-2">Share Link</p>
            <p className="text-sm text-gray-900 break-all">{referralLink}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copyReferralLink}
              className="flex items-center justify-center py-3 bg-purple-50 text-purple-600 rounded-lg font-medium"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={shareReferralLink}
              className="flex items-center justify-center py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Share Your Link</p>
                <p className="text-sm text-gray-600">Send your referral link to friends and family</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">They Sign Up</p>
                <p className="text-sm text-gray-600">Your friends join Ready9ja using your link</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">You Earn Rewards</p>
                <p className="text-sm text-gray-600">Get ₦2,000 for each successful referral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Levels */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Reward Levels</h3>
          
          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  reward.achieved
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    reward.achieved ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {reward.achieved ? (
                      <Trophy className="w-5 h-5 text-white" />
                    ) : (
                      <Star className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      reward.achieved ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {reward.level} Level
                    </p>
                    <p className="text-sm text-gray-600">
                      {reward.referrals} referrals • {formatPrice(reward.bonus)} bonus
                    </p>
                  </div>
                </div>
                {reward.achieved && (
                  <div className="text-green-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Referrals</h3>
          
          {recentReferrals.length > 0 ? (
            <div className="space-y-3">
              {recentReferrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">
                        {referral.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{referral.name}</p>
                      <p className="text-sm text-gray-600">
                        Joined {referral.joinDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      referral.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                    {referral.earnings > 0 && (
                      <p className="text-sm font-semibold text-purple-600 mt-1">
                        {formatPrice(referral.earnings)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No referrals yet</p>
              <p className="text-sm text-gray-500">Start sharing your link to earn rewards!</p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Earn ₦2,000 for each friend who signs up and makes their first purchase</p>
            <p>• Referral bonuses are credited within 24 hours of qualifying purchase</p>
            <p>• Minimum withdrawal amount is ₦5,000</p>
            <p>• Bonuses expire after 90 days if not withdrawn</p>
          </div>
          <button className="flex items-center text-purple-600 text-sm font-medium mt-3">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Full Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;