import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CATEGORY_COLORS } from '../constants/theme';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  BookOpen, 
  Zap, 
  Music, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  X 
} from 'lucide-react';

export type ToastType = 
  | 'success' 
  | 'error' 
  | 'info' 
  | 'entertainment' 
  | 'education' 
  | 'creator' 
  | 'music' 
  | 'productivity';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, description?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((
    message: string, 
    type: ToastType, 
    description?: string, 
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, description, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastPortal toasts={toasts} dismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal portal container to display active alerts
const ToastPortal: React.FC<{ toasts: Toast[]; dismiss: (id: string) => void }> = ({ toasts, dismiss }) => {
  return createPortal(
    <div className="fixed top-6 right-6 z-[999999] flex flex-col gap-3.5 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} dismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

const ToastCard: React.FC<{ toast: Toast; dismiss: (id: string) => void }> = ({ toast, dismiss }) => {
  const { id, message, description, type, duration = 4000 } = toast;
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      dismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dismiss, isPaused]);

  // Visual Theme mappings
  const getThemeConfig = (t: ToastType) => {
    const catConfig = CATEGORY_COLORS[t];
    if (catConfig) {
      const { colorName, themeColor, glowColor } = catConfig;
      let icon = <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;
      if (t === 'entertainment') icon = <Tv className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;
      else if (t === 'education') icon = <BookOpen className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;
      else if (t === 'creator') icon = <Zap className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;
      else if (t === 'music') icon = <Music className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;
      else if (t === 'productivity') icon = <Activity className="w-5 h-5 shrink-0" style={{ color: themeColor }} />;

      const isWhite = colorName === 'white';
      const glowClass = isWhite
        ? 'shadow-[0_0_25px_rgba(255,255,255,0.1)] border-white/20 hover:border-white/40'
        : `shadow-[0_0_25px_${glowColor}] border-${colorName}-500/20 hover:border-${colorName}-500/40`;
      const barColor = isWhite ? 'bg-white/40' : `bg-${colorName}-500`;
      const titleColor = isWhite ? 'text-white/80' : `text-${colorName}-200`;

      return {
        icon,
        glowClass,
        barColor,
        titleColor
      };
    }

    switch (t) {
      case 'error': {
        const errConfig = CATEGORY_COLORS.error || { themeColor: '#ef4444', glowColor: 'rgba(239,68,68,0.22)', colorName: 'rose' };
        return {
          icon: <AlertCircle className="w-5 h-5 shrink-0" style={{ color: errConfig.themeColor }} />,
          glowClass: `shadow-[0_0_25px_${errConfig.glowColor}] border-${errConfig.colorName}-600/30 hover:border-${errConfig.colorName}-600/50`,
          barColor: `bg-${errConfig.colorName}-500`,
          titleColor: `text-${errConfig.colorName}-200`
        };
      }
      case 'info': {
        const infConfig = CATEGORY_COLORS.info || { themeColor: '#3b82f6', glowColor: 'rgba(59,130,246,0.18)', colorName: 'blue' };
        return {
          icon: <Info className="w-5 h-5 shrink-0" style={{ color: infConfig.themeColor }} />,
          glowClass: `shadow-[0_0_25px_${infConfig.glowColor}] border-${infConfig.colorName}-500/20 hover:border-${infConfig.colorName}-500/40`,
          barColor: `bg-${infConfig.colorName}-500`,
          titleColor: `text-${infConfig.colorName}-200`
        };
      }
      case 'success':
      default: {
        const succConfig = CATEGORY_COLORS.success || { themeColor: '#d946ef', glowColor: 'rgba(217,70,239,0.18)', colorName: 'fuchsia' };
        return {
          icon: <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: succConfig.themeColor }} />,
          glowClass: `shadow-[0_0_25px_${succConfig.glowColor}] border-${succConfig.colorName}-500/20 hover:border-${succConfig.colorName}-500/40`,
          barColor: `bg-gradient-to-r from-${succConfig.colorName}-500 to-purple-500`,
          titleColor: `text-${succConfig.colorName}-200`
        };
      }
    }
  };

  const theme = getThemeConfig(type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full overflow-hidden p-4 rounded-2xl bg-[#151B2F]/90 backdrop-blur-xl border pointer-events-auto flex gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all cursor-default select-none ${theme.glowClass}`}
    >
      {/* Dynamic sphere-specific icon */}
      {theme.icon}

      <div className="flex-1 flex flex-col pr-2">
        <h4 className={`text-xs font-black tracking-tight leading-none mb-1 ${theme.titleColor}`}>
          {message}
        </h4>
        {description && (
          <p className="text-[10px] text-white/50 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => dismiss(id)}
        className="p-1 rounded-lg bg-white/0 hover:bg-white/10 text-white/40 hover:text-white transition-colors self-start cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Dynamic loading progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/5">
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: isPaused ? undefined : 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full origin-left ${theme.barColor}`}
          style={{ width: '100%' }}
        />
      </div>
    </motion.div>
  );
};
