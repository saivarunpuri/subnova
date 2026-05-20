import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { useUIStore } from '../store/uiStore';
import type { RootState } from '../store/store';
import { 
  Rocket, 
  Film, 
  GraduationCap, 
  Paintbrush, 
  Music, 
  Briefcase,
  LayoutDashboard,
  UserCircle,
  Activity,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CATEGORY_COLORS, GLOBAL_STRINGS } from '../constants/theme';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { activeSpace, setActiveSpace } = useUIStore();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAnalyticsActive = activeSpace === 'analytics';
  const shouldBlur = isAnalyticsActive && !isHovered;

  // Dynamic mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Click outside listener for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'discover', icon: Rocket, label: GLOBAL_STRINGS.discover },
    { id: 'entertainment', icon: Film, label: GLOBAL_STRINGS.entertainment },
    { id: 'education', icon: GraduationCap, label: GLOBAL_STRINGS.education },
    { id: 'creator', icon: Paintbrush, label: GLOBAL_STRINGS.creator },
    { id: 'music', icon: Music, label: GLOBAL_STRINGS.music },
    { id: 'productivity', icon: Briefcase, label: GLOBAL_STRINGS.productivity },
  ].map(item => {
    const config = CATEGORY_COLORS[item.id] || { themeColor: '#f8fafc', colorName: 'white' };
    const colorClass = config.colorName === 'white'
      ? 'shadow-white/10 text-white'
      : `shadow-${config.colorName}-500/20 text-${config.colorName}-400`;
    return {
      ...item,
      color: colorClass,
      themeColor: config.themeColor
    };
  });

  if (user?.role === 'admin') {
    const config = CATEGORY_COLORS.analytics || { themeColor: '#d946ef', colorName: 'fuchsia' };
    navItems.push({ 
      id: 'analytics', 
      icon: Activity, 
      label: GLOBAL_STRINGS.analytics, 
      color: `shadow-${config.colorName}-500/20 text-${config.colorName}-400`, 
      themeColor: config.themeColor 
    });
  } else {
    const config = CATEGORY_COLORS.dashboard || { themeColor: '#6366f1', colorName: 'indigo' };
    navItems.push({ 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: GLOBAL_STRINGS.dashboard, 
      color: `shadow-${config.colorName}-500/20 text-${config.colorName}-400`, 
      themeColor: config.themeColor 
    });
  }

  // Unified items list: Navigation Items (middle), User Profile (right)
  const items = [
    ...navItems.map(item => ({ type: 'nav' as const, navItem: item })),
    { type: 'profile' as const }
  ];

  const curveDepth = isMobile ? 22 : 65; // vertical dip of the U shape

  // Responsive SVG paths (completely bounded within 0-150 viewBox height for desktop and 0-95 for mobile)
  const mainPath = isMobile
    ? "M 15 10 Q 550 45 1085 10 Q 1095 15 1080 46 Q 550 81 20 46 Q 5 15 15 10 Z"
    : "M 20 20 Q 550 100 1080 20 Q 1090 25 1075 65 Q 550 145 25 65 Q 10 25 20 20 Z";

  const topGlowPath = isMobile
    ? "M 15 10 Q 550 45 1085 10"
    : "M 20 20 Q 550 100 1080 20";

  const bottomGlowPath = isMobile
    ? "M 20 46 Q 550 81 1080 46"
    : "M 25 65 Q 550 145 1075 65";

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-[92rem] px-2 sm:px-4 md:px-6 pointer-events-none select-none">
      <motion.div 
        className="w-full relative flex items-center justify-center pointer-events-auto"
        style={{ height: isMobile ? '82px' : '150px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          filter: shouldBlur ? 'blur(8px)' : 'blur(0px)',
          opacity: shouldBlur ? 0.2 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Dynamic Curved Space Dock SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] hidden sm:block"
          viewBox="0 0 1100 150"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Rich semi-transparent dark cosmic backdrop */}
            <linearGradient id="u-bg-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10172A" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0.94" />
            </linearGradient>
            
            {/* Aurora Eclipse signature border glow */}
            <linearGradient id="u-glow-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#00F5A0" />
              <stop offset="33%"  stopColor="#00D9F5" />
              <stop offset="66%"  stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>

            <filter id="u-neon-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Solid glassmorphic body */}
          <path
            d={mainPath}
            fill="none"
            stroke="transparent"
            strokeWidth="1.5"
          />

          {/* Outer glowing top boundary edge */}
          <path
            d={topGlowPath}
            fill="none"
            stroke="url(#u-glow-gradient)"
            strokeWidth="2"
            opacity="0.8"
            filter="url(#u-neon-blur)"
          />

          {/* Outer glowing bottom boundary edge */}
          <path
            d={bottomGlowPath}
            fill="none"
            stroke="url(#u-glow-gradient)"
            strokeWidth="2.5"
            opacity="0.9"
            filter="url(#u-neon-blur)"
          />
        </svg>

        {/* Foreground Content: Layout matching the curves */}
        <div className="w-full h-full flex items-center sm:items-start justify-between gap-0.5 sm:gap-1 md:gap-2 overflow-visible px-1.5 py-2 sm:px-3 md:px-6 lg:px-10 relative z-10 bg-transparent border-0 rounded-3xl sm:rounded-none">
          {items.map((item, idx) => {
            // Calculate mathematical offset along the sine wave
            const t = items.length > 1 ? idx / (items.length - 1) : 0.5;
            const buttonHeight = isMobile ? 40 : 44;
            const ribbonCenterStart = isMobile ? 40 : 42.5;
            const dip = isMobile ? 0 : 40;
            const baseTranslateY = isMobile ? 0 : (ribbonCenterStart - buttonHeight / 2) + dip * Math.sin(t * Math.PI);


            if (item.type === 'profile') {
              if (!user) {
                return (
                  <motion.div
                    key="login-btn"
                    style={{ y: baseTranslateY }}
                    whileHover={{ y: baseTranslateY - 6, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="pointer-events-auto shrink-0 animate-pulse hover:animate-none"
                  >
                    <button
                      onClick={() => navigate('/login')}
                      className="w-9 h-9 md:w-11 md:h-11 rounded-2xl flex items-center justify-center cursor-pointer border border-white/12 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_22px_rgba(0,245,160,0.4)] group"
                      style={{ background: 'linear-gradient(135deg, #00F5A0, #00D9F5)' }}
                      title="Access Login"
                    >
                      <UserCircle className="w-5.5 h-5.5 md:w-6 md:h-6 text-white/80 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </motion.div>
                );
              }

              return (
                <div key="profile" ref={profileRef} className="relative">
                  <motion.div
                    style={{ y: baseTranslateY }}
                    whileHover={{ y: baseTranslateY - 6, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="pointer-events-auto shrink-0"
                  >
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className={cn(
                        "w-9 h-9 md:w-11 md:h-11 rounded-2xl flex items-center justify-center cursor-pointer border border-white/12 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_22px_rgba(0,245,160,0.35)]",
                        profileMenuOpen ? "ring-2 shadow-xl" : ""
                      )}
                      style={{ background: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 50%, #FF6B6B 100%)' }}
                    >
                      <UserCircle className="w-5.5 h-5.5 md:w-6 md:h-6 text-white" />
                      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                    </button>
                  </motion.div>

                  {/* Glassmorphic Floating Profile Cockpit Menu */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute bottom-14 sm:bottom-16 md:bottom-20 right-0 w-[min(16rem,calc(100vw-2rem))] backdrop-blur-3xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_25px_rgba(0,245,160,0.15)] pointer-events-auto flex flex-col gap-3.5 text-left z-50"
                        style={{ background: 'rgba(16,23,42,0.95)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/15 text-white font-bold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, #00F5A0, #00D9F5)' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-none">{user.name}</h4>
                            <span className="text-[9px] text-white/50 leading-none capitalize mt-1.5 inline-block bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 font-bold tracking-wider">
                              {user.role}
                            </span>
                          </div>
                        </div>
                        
                        <div className="h-[1px] bg-white/10 w-full" />
                        
                        <div className="text-[10px] text-white/60 space-y-1.5 font-medium">
                          <p className="flex justify-between"><span>{GLOBAL_STRINGS.nodeSecurity}:</span> <span className="font-bold" style={{ color: '#00D9F5' }}>{GLOBAL_STRINGS.sslGated}</span></p>
                          <p className="flex justify-between"><span>{GLOBAL_STRINGS.status}:</span> <span className="text-emerald-400 font-bold">{GLOBAL_STRINGS.active}</span></p>
                        </div>

                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            dispatch(logout());
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/35 transition-all duration-300 font-bold text-xs cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {GLOBAL_STRINGS.disconnectProfile}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Navigation buttons
            if (item.type === 'nav' && item.navItem) {
              const navItem = item.navItem;
              const isActive = activeSpace === navItem.id;
              const Icon = navItem.icon;

              return (
                <motion.div
                  key={navItem.id}
                  style={{ y: baseTranslateY }}
                  whileHover={{ y: baseTranslateY - 10, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="pointer-events-auto"
                >
                  <button
                    onClick={() => {
                      if (!user && (navItem.id === 'dashboard' || navItem.id === 'analytics')) {
                        navigate('/login');
                      } else {
                        navigate(`/${navItem.id}`);
                      }
                    }}
                    className={cn(
                      "relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-[clamp(0.25rem,0.6vw,0.5rem)] min-w-0 flex-1 px-[clamp(0.35rem,0.9vw,1rem)] py-2 md:py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer focus:outline-none",
                      isActive ? "text-white font-bold" : "text-white/40 hover:text-white"
                    )}
                  >
                    {/* Sliding Themed Active Pill Background */}
                    {isActive && (
                      <motion.div
                        layoutId="active-bottom-nav"
                        className={cn(
                          "absolute inset-0 bg-white/10 rounded-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
                          navItem.color
                        )}
                        style={{
                          boxShadow: `0 0 25px ${navItem.themeColor}20, inset 0 1px 1px rgba(255,255,255,0.12)`
                        }}
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}

                    {/* Dynamic bottom neon glow spotlight for active spaces */}
                    {isActive && (
                      <div 
                        className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-7 rounded-full filter blur-xl opacity-90 pointer-events-none transition-all duration-500"
                        style={{ backgroundColor: navItem.themeColor }}
                      />
                    )}

                    {/* Animated Icon Lift */}
                    <motion.div
                      animate={isActive ? { y: -2, scale: 1.05 } : { y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="z-10 flex items-center justify-center shrink-0"
                    >
                      <Icon 
                        className="w-4 h-4 md:w-[clamp(1rem,1.35vw,1.25rem)] md:h-[clamp(1rem,1.35vw,1.25rem)] z-10 transition-colors duration-300 shrink-0"
                        style={{ color: isActive ? navItem.themeColor : 'currentColor' }}
                      />
                    </motion.div>
                    
                    {/* Labels scale down to keep the dock fitted without horizontal scrolling */}
                    <span className="text-[clamp(0.45rem,0.75vw,0.75rem)] font-bold tracking-[clamp(0.04em,0.18vw,0.16em)] uppercase z-10 hidden sm:inline select-none truncate max-w-[clamp(3.1rem,8vw,8rem)]">
                      {navItem.label}
                    </span>

                    {/* Mini Mobile Active indicator dot */}
                    {isActive && (
                      <div 
                        className="lg:hidden w-1.5 h-1.5 rounded-full absolute bottom-1.5 shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: navItem.themeColor, color: navItem.themeColor }}
                      ></div>
                    )}
                  </button>
                </motion.div>
              );
            }

            return null;
          })}
        </div>
      </motion.div>
    </div>
  );
};
