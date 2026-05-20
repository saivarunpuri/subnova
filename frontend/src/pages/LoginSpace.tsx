import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import api from '../services/api';
import { UserCircle, Loader2, Lock, Mail, User, Phone } from 'lucide-react';
import type { RootState } from '../store/store';

export const LoginSpace: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        const { data } = await api.post('/auth/register', { name, email, phoneNumber, password });
        const { token, ...userData } = data;
        dispatch(setCredentials({ user: userData, token }));
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        const { token, ...userData } = data;
        dispatch(setCredentials({ user: userData, token }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none transition-all text-sm"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto px-3 sm:px-0"
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-8"
        style={{
          background: 'rgba(16,23,42,0.7)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(0,245,160,0.06)',
        }}
      >
        {/* Aurora glow blobs */}
        <div className="absolute -top-28 -right-28 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,245,160,0.12)' }} />
        <div className="absolute -bottom-28 -left-28 w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,217,245,0.10)' }} />
        <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(255,107,107,0.07)' }} />

        {/* Animated border gradient trace */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100"
            style={{ background: 'linear-gradient(120deg, #00F5A0, #00D9F5, #FF6B6B, #FFD166)', backgroundSize: '300% 300%' }}
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10">
          {/* Avatar orb */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <motion.div
              className="p-4 rounded-2xl border border-white/10 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              animate={{ boxShadow: ['0 0 15px rgba(0,245,160,0.2)', '0 0 30px rgba(0,217,245,0.3)', '0 0 15px rgba(0,245,160,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <UserCircle className="w-12 h-12 text-white/80" />
              {/* Hologram scan */}
              <motion.div
                className="absolute inset-0 w-full"
                style={{ background: 'linear-gradient(0deg, transparent, rgba(0,245,160,0.15), transparent)', height: '40%' }}
                animate={{ y: ['-100%', '300%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl sm:text-3xl font-black text-white text-center mb-1 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {isRegistering ? 'Create Portal' : 'Access Portal'}
          </h2>
          <p className="text-white/40 text-center mb-5 sm:mb-7 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isRegistering
              ? 'Join the aurora to access your premium bundles'
              : 'Enter your credentials to enter the universe'}
          </p>

          {/* Tab switcher — Aurora Eclipse */}
          <div className="flex border border-white/10 rounded-xl p-1 mb-5 sm:mb-7" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {[{ label: 'Sign In', active: !isRegistering }, { label: 'Sign Up', active: isRegistering }].map(({ label, active }, i) => (
              <button
                key={label}
                type="button"
                onClick={() => { setIsRegistering(i === 1); setError(null); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${active ? 'text-[#050816]' : 'text-white/45 hover:text-white'}`}
                style={active ? {
                  background: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 100%)',
                  boxShadow: '0 0 18px rgba(0,245,160,0.25)',
                } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-3.5 sm:space-y-4">
            <AnimatePresence initial={false}>
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-bold uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" required={isRegistering}
                        className={inputClass}
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(0,245,160,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-bold uppercase tracking-wider ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input
                        type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 9876543210" required={isRegistering}
                        className={inputClass}
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(0,245,160,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wider ml-1">
                {isRegistering ? 'Email Address' : 'Username or Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={isRegistering ? 'email' : 'text'} value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRegistering ? 'name@domain.com' : 'username or name@domain.com'} required
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,245,160,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wider ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className={inputClass}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,245,160,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl text-sm text-center border"
                style={{ background: 'rgba(255,107,107,0.08)', borderColor: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit — Aurora CTA */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
              style={{
                background: 'linear-gradient(120deg, #00F5A0 0%, #00D9F5 50%, #FF6B6B 100%)',
                color: '#050816',
                fontFamily: "'Outfit', sans-serif",
                boxShadow: '0 0 25px rgba(0,245,160,0.3)',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,245,160,0.45)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRegistering ? (
                'Initialize Account'
              ) : (
                'Enter the Universe'
              )}
            </motion.button>
          </form>

          {/* Bottom switch */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
              className="text-white/40 hover:text-white text-sm transition-all cursor-pointer"
            >
              {isRegistering ? (
                <>Already have an account?{' '}<span className="font-bold" style={{ color: '#00D9F5' }}>Sign In</span></>
              ) : (
                <>Don't have an account?{' '}<span className="font-bold" style={{ color: '#00F5A0' }}>Sign Up</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
