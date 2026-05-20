import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useGetMyPayments, type MyPaymentRecord } from '../hooks/usePayment';
import {
  Wallet, Clock, CheckCircle, Flame, Eye, EyeOff, Copy, Check, Shield, X, Layers, Loader2, AlertTriangle
} from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Active' },
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Pending' },
  Rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Rejected' },
};

const CredentialCard = ({ payment }: { payment: MyPaymentRecord }) => {
  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const pack = payment.bundleId && typeof payment.bundleId === 'object' ? payment.bundleId : null;
  const brandName = pack?.brand && typeof pack.brand === 'object' ? pack.brand.name : '';
  const packTitle = pack?.title || '';
  const bundleTitle = brandName && packTitle
    ? `${brandName} - ${packTitle}`
    : packTitle || brandName || payment.bundleTitle || 'Bundle';
  const status = STATUS_STYLES[payment.status] || STATUS_STYLES.Pending;
  const hasCredentials = payment.status === 'Approved' && payment.ottUsername && payment.ottPassword;

  // Compute expiry date from validity string (e.g. "1 month", "3 months", "1 year")
  const computeExpiry = (): Date | null => {
    const validity = pack?.validity;
    if (!validity || !payment.createdAt) return null;
    const created = new Date(payment.createdAt);
    const lower = validity.toLowerCase().trim();
    const numMatch = lower.match(/^(\d+)/);
    const num = numMatch ? parseInt(numMatch[1], 10) : 1;
    if (lower.includes('year')) {
      created.setFullYear(created.getFullYear() + num);
    } else if (lower.includes('month')) {
      created.setMonth(created.getMonth() + num);
    } else if (lower.includes('week')) {
      created.setDate(created.getDate() + num * 7);
    } else if (lower.includes('day')) {
      created.setDate(created.getDate() + num);
    } else {
      return null;
    }
    return created;
  };

  const expiryDate = computeExpiry();
  const isExpired = expiryDate ? expiryDate.getTime() < Date.now() : false;
  const daysLeft = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div
        className={`relative bg-[#0d1424]/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${
          expanded ? 'border-purple-500/40 shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]' : 'border-white/[0.06] hover:border-white/10'
        }`}
      >
        {/* Main Row */}
        <button
          onClick={() => hasCredentials && setExpanded(!expanded)}
          className={`w-full p-4 sm:p-5 flex items-center gap-4 text-left transition-colors ${
            hasCredentials ? 'cursor-pointer hover:bg-white/[0.02]' : 'cursor-default'
          }`}
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            payment.status === 'Approved' ? 'bg-purple-500/15' : payment.status === 'Pending' ? 'bg-amber-500/15' : 'bg-rose-500/15'
          }`}>
            {payment.status === 'Approved' ? <Shield className="w-6 h-6 text-purple-400" /> 
              : payment.status === 'Pending' ? <Clock className="w-6 h-6 text-amber-400" />
              : <AlertTriangle className="w-6 h-6 text-rose-400" />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-sm sm:text-base truncate">{bundleTitle}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-white/40 text-xs">₹{payment.amount}</span>
              <span className="text-white/20">•</span>
              <span className="text-white/40 text-xs">{new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              {expiryDate && (
                <>
                  <span className="text-white/20">•</span>
                  <span className={`text-xs font-medium ${isExpired ? 'text-rose-400' : daysLeft !== null && daysLeft <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isExpired
                      ? 'Expired'
                      : `Expires ${expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    {!isExpired && daysLeft !== null && (
                      <span className="text-white/30 ml-1">({daysLeft}d left)</span>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
            {status.label}
          </span>

          {/* Expand arrow */}
          {hasCredentials && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              className="text-white/30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          )}
        </button>

        {/* Expanded Credentials Section */}
        <AnimatePresence>
          {expanded && hasCredentials && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 pt-1">
                <div className="border-t border-white/[0.06] pt-4 space-y-3">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    Your OTT Credentials
                  </p>

                  {/* Username */}
                  <div className="bg-white/[0.03] rounded-xl p-3 flex items-center justify-between border border-white/[0.06]">
                    <div className="min-w-0">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Username</p>
                      <p className="text-white font-mono text-sm truncate">{payment.ottUsername}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(payment.ottUsername!, 'user'); }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white shrink-0 cursor-pointer"
                    >
                      {copiedField === 'user' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password */}
                  <div className="bg-white/[0.03] rounded-xl p-3 flex items-center justify-between border border-white/[0.06]">
                    <div className="min-w-0">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Password</p>
                      <p className="text-white font-mono text-sm truncate">
                        {showPassword ? payment.ottPassword : '••••••••••'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(payment.ottPassword!, 'pass'); }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white cursor-pointer"
                      >
                        {copiedField === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Non-approved message */}
        {expanded && !hasCredentials && payment.status === 'Pending' && (
          <div className="px-5 pb-5 pt-1">
            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-amber-400/80 text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Your payment is being reviewed. Credentials will appear here once approved.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const DashboardSpace = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: payments, isLoading } = useGetMyPayments();

  const approvedCount = payments?.filter(p => p.status === 'Approved').length || 0;
  const pendingCount = payments?.filter(p => p.status === 'Pending').length || 0;
  const totalSpent = payments?.filter(p => p.status === 'Approved').reduce((s, p) => s + p.amount, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
          Welcome back, {user?.name || 'Space Explorer'}
        </h1>
        <p className="text-gray-400">Your subscription universe at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { title: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: Wallet, color: 'emerald' },
          { title: 'Active Bundles', value: String(approvedCount), icon: Flame, color: 'purple' },
          { title: 'Pending Verification', value: String(pendingCount), icon: Clock, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-[#0d1424]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-white/40 text-xs font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${stat.color}-500/15`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Bundles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-500/15">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">My Bundles</h2>
            <p className="text-white/40 text-xs">Click on an active bundle to view your OTT credentials</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : !payments || payments.length === 0 ? (
          <div className="text-center py-20 bg-[#0d1424]/50 rounded-2xl border border-white/[0.06]">
            <Layers className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No bundles yet. Explore the universe and subscribe!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <CredentialCard key={payment._id} payment={payment} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
