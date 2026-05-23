import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { QrCode, Upload, CheckCircle2, ArrowRight, X, Loader2, Orbit, ShieldCheck, Sparkles, ChevronLeft, Copy, Check } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useSubmitPayment } from '../../hooks/usePayment';
import { useValidateCoupon } from '../../hooks/useCoupons';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/theme';

export const PaymentFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPaymentOpen, setPaymentOpen, selectedBundle, setSelectedBundle } = useUIStore();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    if (!settings?.upiId) return;
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };
  
  const { data: settings } = useSettings();
  const submitPaymentMutation = useSubmitPayment();
  const validateCouponMutation = useValidateCoupon();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput || !selectedBundle) return;
    setCouponError('');
    try {
      const res = await validateCouponMutation.mutateAsync({
        code: couponCodeInput,
        packId: selectedBundle._id
      });
      setAppliedCoupon(res);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const theme = selectedBundle?.category ? CATEGORY_COLORS[selectedBundle.category.toLowerCase()] || DEFAULT_CATEGORY_COLOR : DEFAULT_CATEGORY_COLOR;
  const cName = theme.colorName;

  const handleClose = () => {
    setPaymentOpen(false);
    setTimeout(() => {
      setStep(1);
      setFile(null);
      setTransactionId('');
      setSelectedBundle(null);
      setCouponCodeInput('');
      setCouponError('');
      setAppliedCoupon(null);
    }, 400);

    if (location.pathname.startsWith('/pack/')) {
      navigate('/discover');
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const isValidTxnId = transactionId.length === 12 && /^\d{12}$/.test(transactionId);

  const handleSubmit = async () => {
    if (!file || !selectedBundle || !isValidTxnId) return;
    
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('bundleId', selectedBundle._id);
    formData.append('amount', (appliedCoupon ? appliedCoupon.discountedPrice : selectedBundle.bundlePrice).toString());
    formData.append('bundleTitle', selectedBundle.title);
    formData.append('transactionId', transactionId);
    if (appliedCoupon) {
      formData.append('couponCode', appliedCoupon.code);
    }

    try {
      await submitPaymentMutation.mutateAsync(formData);
      setStep(3);
    } catch (error) {
      console.error('Payment submission failed:', error);
    }
  };

  if (!isPaymentOpen) return null;

  return (
    <AnimatePresence>
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-12 overflow-y-auto pointer-events-auto">
          {/* Deep blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0B0914]/90 backdrop-blur-2xl"
          />

          {/* Main Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[94dvh] lg:h-[700px] bg-[#110D1E]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] shadow-2xl flex flex-col lg:flex-row overflow-hidden"
            style={{ boxShadow: `0 30px 100px -20px ${theme.glowColor}, inset 0 0 0 1px rgba(255,255,255,0.05)` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={handleClose} 
              className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Order Summary (Stellar Theme) */}
            <div className="w-full lg:w-[45%] p-5 sm:p-8 lg:p-12 flex flex-col relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
              {/* Animated Background Accents */}
              <div 
                className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none" 
                style={{ backgroundColor: theme.themeColor }} 
              />
              <div 
                className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none" 
                style={{ backgroundColor: theme.themeColor }} 
              />

              <div className="flex-1 flex flex-col relative z-10">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-5 sm:mb-8 lg:mb-12 pr-10">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-white/70 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: theme.themeColor }} />
                    {selectedBundle?.category || 'Premium'} Access
                  </span>
                </div>

                {/* Steps Timeline in Left Column */}
                <div className="flex-1 flex flex-col justify-center my-2 sm:my-6 relative z-10">
                  <p className="text-white/40 text-sm font-medium tracking-widest uppercase mb-2">You are unlocking</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 leading-tight mb-3 sm:mb-4">
                    {selectedBundle?.title || 'Stellar Bundle'}
                  </h2>

                  {/* Price Breakdown */}
                  <div className="flex items-baseline gap-2 mb-5 sm:mb-8 lg:mb-10 flex-wrap">
                    {appliedCoupon ? (
                      <>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 40px ${theme.glowColor}` }}>
                          ₹{appliedCoupon.discountedPrice}
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-white/30 line-through">
                          ₹{selectedBundle?.bundlePrice}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                          -{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 40px ${theme.glowColor}` }}>
                        ₹{selectedBundle?.bundlePrice || 499}
                      </span>
                    )}
                    <span className="text-white/40 font-medium">/ term</span>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-4 lg:gap-6 text-left relative mt-4">
                    {/* Connecting Line */}
                    <div className="absolute left-[15px] top-4 bottom-8 w-px bg-white/10 hidden lg:block" />

                    {/* Step 1 */}
                    <div className={`flex gap-5 relative z-10 transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#110D1E] border flex items-center justify-center text-xs font-black shrink-0 shadow-lg transition-colors" style={{ borderColor: step === 1 ? theme.themeColor : 'rgba(255,255,255,0.2)', color: step === 1 ? theme.themeColor : 'white' }}>
                        1
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-white font-bold text-sm mb-1">Scan & Pay</h4>
                        <p className="text-white/50 text-xs leading-relaxed hidden sm:block lg:block">Open any UPI app and pay the exact amount. Take a screenshot.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className={`flex gap-5 relative z-10 transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#110D1E] border flex items-center justify-center text-xs font-black shrink-0 shadow-lg transition-colors" style={{ borderColor: step === 2 ? theme.themeColor : 'rgba(255,255,255,0.2)', color: step === 2 ? theme.themeColor : 'white' }}>
                        2
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-white font-bold text-sm mb-1">Verify Proof</h4>
                        <p className="text-white/50 text-xs leading-relaxed hidden sm:block lg:block">Upload the success screenshot and optional transaction ID.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={`flex gap-5 relative z-10 transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#110D1E] border flex items-center justify-center text-xs font-black shrink-0 shadow-lg transition-colors" style={{ borderColor: step === 3 ? theme.themeColor : 'rgba(255,255,255,0.2)', color: step === 3 ? theme.themeColor : 'white' }}>
                        3
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-white font-bold text-sm mb-1">Verification</h4>
                        <p className="text-white/50 text-xs leading-relaxed hidden sm:block lg:block">System verifies payment and activates bundle instantly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="hidden sm:flex items-center gap-2 text-white/30 text-xs mt-auto pt-6 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Secure transaction powered by SUBNOVA 256-bit encryption.
                </div>
              </div>
            </div>

            {/* Right Column: Action Area */}
            <div className="w-full lg:w-[55%] flex flex-col min-h-0 relative z-10 bg-[#0B0914]/50">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 lg:p-12">
                
                {/* Empty spacer or subtle top decoration can go here since we removed the top step indicator */}
                <div className="h-0 sm:h-3 lg:h-6" />

                <AnimatePresence mode="wait">
                  {/* STEP 1: SCAN & PAY */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center text-center justify-center min-h-full"
                    >
                      <h3 className="text-2xl font-bold text-white mb-4">Scan to Transfer</h3>
                      <p className="text-white/60 mb-6 sm:mb-10 leading-relaxed text-sm max-w-sm">
                        Open your preferred UPI application and scan the holographic code below to initiate the secure transfer.
                      </p>

                      {/* Holographic QR Container */}
                      <div className="relative group mb-7 sm:mb-12">
                        {/* Outer rotating glow */}
                        <div 
                          className="absolute -inset-1 rounded-[40px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none"
                          style={{ background: `linear-gradient(45deg, ${theme.themeColor}, transparent, ${theme.themeColor})` }}
                        />
                        
                        <div className="relative p-6 sm:p-8 rounded-[32px] bg-[#110D1E] border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">
                          {/* Inner glass reflections */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                          
                          {/* The QR Image */}
                          <div className="w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-white rounded-2xl p-3 relative z-10">
                            <img 
                              src={
                                settings?.paymentQrUrl
                                  ? settings.paymentQrUrl.startsWith('http')
                                    ? settings.paymentQrUrl
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${settings.paymentQrUrl}`
                                  : "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=UPI_ID_HERE"
                              } 
                              alt="Payment QR" 
                              className="w-full h-full object-contain rounded-xl" 
                            />
                          </div>

                          {/* Corner Accents */}
                          <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 opacity-50" style={{ borderColor: theme.themeColor }} />
                          <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 opacity-50" style={{ borderColor: theme.themeColor }} />
                          <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 opacity-50" style={{ borderColor: theme.themeColor }} />
                          <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 opacity-50" style={{ borderColor: theme.themeColor }} />
                        </div>
                      </div>

                      {/* Copy UPI Address Card */}
                      {settings?.upiId && (
                        <div className="w-full max-w-sm mb-7 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-2">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Or Transfer to UPI Address Directly</span>
                          <div className="w-full flex items-center justify-between gap-3 bg-[#0d091a] border border-white/5 rounded-xl p-2 mt-1 font-mono text-xs">
                            <span className="text-white font-bold select-all truncate pl-2">{settings.upiId}</span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] tracking-wide transition-all cursor-pointer shrink-0 ${
                                copiedUpi
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                              }`}
                            >
                              {copiedUpi ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy ID
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Coupon Code Input in Step 1 */}
                      <div className="w-full mb-6 border-t border-white/5 pt-6 text-left">
                        <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Have a coupon code?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            disabled={!!appliedCoupon}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="ENTER CODE (e.g. SAVE50)"
                            className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                              appliedCoupon 
                                ? 'border-emerald-500/40 focus:border-emerald-500/50 bg-emerald-500/5' 
                                : couponError 
                                ? 'border-rose-500/40 focus:border-rose-500/50' 
                                : 'border-white/10 focus:border-white/30'
                            }`}
                          />
                          {appliedCoupon ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAppliedCoupon(null);
                                setCouponCodeInput('');
                              }}
                              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-rose-400 hover:text-rose-300 font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={!couponCodeInput || validateCouponMutation.isPending}
                              onClick={handleApplyCoupon}
                              className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                                couponCodeInput 
                                  ? 'bg-white text-black hover:bg-white/90' 
                                  : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed shadow-none'
                              }`}
                            >
                              {validateCouponMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Apply
                            </button>
                          )}
                        </div>

                        {/* Coupon validation message */}
                        {couponError && (
                          <p className="text-rose-400 text-xs mt-2 font-medium">✗ {couponError}</p>
                        )}
                        {appliedCoupon && (
                          <p className="text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1.5 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" />
                            ✓ Success! Coupon applied. You saved ₹{appliedCoupon.discountAmount}.
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-4 sm:py-5 mt-auto rounded-2xl font-black text-sm tracking-wide text-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                      >
                        Proceed to Verification
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: UPLOAD PROOF */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      <button 
                        onClick={() => setStep(1)} 
                        className="self-start flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-colors mb-8 cursor-pointer uppercase tracking-wider"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back to QR Code
                      </button>

                      <p className="text-white/60 mb-6 sm:mb-8 leading-relaxed text-sm">
                        Upload a screenshot of your successful transaction to grant our systems immediate verification context.
                      </p>

                      {/* Drag & Drop Zone */}
                      <label 
                        className="relative w-full h-44 sm:h-56 rounded-[24px] sm:rounded-[32px] flex flex-col items-center justify-center cursor-pointer group overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 hover:bg-white/10 mb-8"
                      >
                        {/* Dashed animated border */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
                          <rect width="100%" height="100%" rx="32" fill="none" stroke={theme.themeColor} strokeWidth="2" strokeDasharray="10 10" className="group-hover:stroke-white transition-colors duration-500" />
                        </svg>

                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                        
                        <div className="relative z-10 flex flex-col items-center text-center px-6">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                            style={{ backgroundColor: theme.glowColor }}
                          >
                            <Upload className="w-7 h-7" style={{ color: theme.themeColor }} />
                          </div>
                          
                          {file ? (
                            <>
                              <p className="font-bold text-white text-lg mb-1 truncate max-w-[250px]">{file.name}</p>
                              <p className="text-white/40 text-xs font-medium">Click to replace image</p>
                            </>
                          ) : (
                            <>
                              <p className="font-bold text-white text-base mb-1">Select payment screenshot</p>
                              <p className="text-white/40 text-xs">Supports PNG, JPG (Max 5MB)</p>
                            </>
                          )}
                        </div>
                      </label>

                      {/* Transaction ID Input */}
                      <div className="relative mb-6">
                        <input 
                          type="text"
                          inputMode="numeric"
                          id="txnId"
                          value={transactionId}
                          maxLength={12}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setTransactionId(val);
                          }}
                          className={`w-full bg-transparent border-b-2 py-4 px-2 text-white font-medium text-lg outline-none transition-colors peer placeholder-transparent ${
                            transactionId.length === 0
                              ? 'border-white/10 focus:border-white'
                              : isValidTxnId
                              ? 'border-emerald-500 focus:border-emerald-400'
                              : 'border-rose-500/70 focus:border-rose-400'
                          }`}
                          placeholder="Transaction ID" 
                        />
                        <label 
                          htmlFor="txnId"
                          className="absolute left-2 top-4 text-white/30 text-lg font-medium transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white/60 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white/60 pointer-events-none"
                        >
                          Transaction ID
                        </label>
                        {/* Live counter + validation hint */}
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs transition-colors ${
                            transactionId.length === 0 ? 'text-white/30'
                            : isValidTxnId ? 'text-emerald-400'
                            : 'text-rose-400'
                          }`}>
                            {transactionId.length === 0
                              ? 'Enter your 12-digit UPI transaction ID'
                              : isValidTxnId
                              ? '✓ Valid transaction ID'
                              : `${12 - transactionId.length} more digit${12 - transactionId.length !== 1 ? 's' : ''} needed`}
                          </p>
                          <span className={`text-xs font-mono tabular-nums ${
                            isValidTxnId ? 'text-emerald-400' : 'text-white/30'
                          }`}>
                            {transactionId.length}/12
                          </span>
                        </div>
                      </div>

                      {/* Coupon Code Input */}
                      <div className="mt-4 mb-auto border-t border-white/5 pt-6">
                        <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Have a coupon code?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            disabled={!!appliedCoupon}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            placeholder="ENTER CODE (e.g. SAVE50)"
                            className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                              appliedCoupon 
                                ? 'border-emerald-500/40 focus:border-emerald-500/50 bg-emerald-500/5' 
                                : couponError 
                                ? 'border-rose-500/40 focus:border-rose-500/50' 
                                : 'border-white/10 focus:border-white/30'
                            }`}
                          />
                          {appliedCoupon ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAppliedCoupon(null);
                                setCouponCodeInput('');
                              }}
                              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-rose-400 hover:text-rose-300 font-bold text-xs transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={!couponCodeInput || validateCouponMutation.isPending}
                              onClick={handleApplyCoupon}
                              className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                couponCodeInput 
                                  ? 'bg-white text-black hover:bg-white/90' 
                                  : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed shadow-none'
                              }`}
                            >
                              {validateCouponMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Apply
                            </button>
                          )}
                        </div>

                        {/* Coupon validation message */}
                        {couponError && (
                          <p className="text-rose-400 text-xs mt-2 font-medium">✗ {couponError}</p>
                        )}
                        {appliedCoupon && (
                          <p className="text-emerald-400 text-xs mt-2 font-medium flex items-center gap-1.5 animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" />
                            ✓ Success! Coupon applied. You saved ₹{appliedCoupon.discountAmount}.
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={!file || !isValidTxnId || submitPaymentMutation.isPending}
                        className={`w-full mt-8 sm:mt-10 py-4 sm:py-5 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                          file && isValidTxnId
                            ? 'text-white' 
                            : 'bg-white/5 text-white/30 cursor-not-allowed shadow-none'
                        }`}
                        style={file && isValidTxnId ? { 
                          background: `linear-gradient(135deg, ${theme.themeColor}, #000000)`,
                          boxShadow: `0 15px 40px -10px ${theme.glowColor}`
                        } : {}}
                      >
                        {submitPaymentMutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            Confirm Verification
                            <CheckCircle2 className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3: SUCCESS */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      className="flex flex-col items-center justify-center h-full text-center py-10"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                        className="w-32 h-32 rounded-[32px] flex items-center justify-center mb-8 relative"
                        style={{ backgroundColor: theme.glowColor }}
                      >
                        <div className="absolute inset-0 blur-2xl opacity-50" style={{ backgroundColor: theme.themeColor }} />
                        <CheckCircle2 className="w-16 h-16 relative z-10" style={{ color: theme.themeColor }} />
                      </motion.div>
                      
                      <h2 className="text-3xl font-bold text-white mb-4">Transmission Sent</h2>
                      <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-12">
                        Your proof of payment has entered the verification matrix. Access will be securely provisioned to your profile within standard Earth minutes.
                      </p>
                      
                      <button
                        onClick={handleClose}
                        className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all cursor-pointer"
                      >
                        Return to Universe
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
