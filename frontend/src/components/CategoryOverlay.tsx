import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrands, usePacks } from '../hooks/useOTT';
import type { OTTBrandData, PackData } from '../hooks/useOTT';
import { useUIStore } from '../store/uiStore';
import { 
  ArrowLeft, 
  Tv, 
  Sparkles, 
  Check, 
  Clock, 
  Tag, 
  TrendingDown, 
  Loader2,
  ChevronRight
} from 'lucide-react';

interface CategoryOverlayProps {
  category: string;
}

export const CategoryOverlay: React.FC<CategoryOverlayProps> = ({ category }) => {
  const { brandId } = useParams<{ brandId?: string }>();
  const { data: brands, isLoading: loadingBrands } = useBrands(category === 'discover' ? undefined : category);
  const [selectedBrand, setSelectedBrand] = useState<OTTBrandData | null>(null);
  
  const { data: packs, isLoading: loadingPacks } = usePacks(selectedBrand?._id);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Synchronize URL brandId with selectedBrand state
  React.useEffect(() => {
    if (brands && brandId) {
      const matched = brands.find(b => b._id === brandId);
      if (matched) {
        setSelectedBrand(matched);
      }
    } else {
      setSelectedBrand(null);
    }
  }, [brands, brandId]);

  // Click outside listener to return to channels when viewing packs
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedBrand && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedBrand(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBrand]);

  const handleSubscribe = (pack: PackData) => {
    console.log('[handleSubscribe] Checking authentication state:', { isAuthenticated, hasToken: !!token });
    if (!isAuthenticated || !token) {
      console.warn('[handleSubscribe] User not fully authenticated. Redirecting to login space.');
      sessionStorage.setItem('redirectAfterLogin', `/pack/${pack._id}`);
      navigate('/login');
      return;
    }

    navigate(`/pack/${pack._id}`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'entertainment': return 'from-rose-500 to-pink-600 shadow-rose-500/20';
      case 'education': return 'from-cyan-500 to-blue-600 shadow-cyan-500/20';
      case 'creator': return 'from-purple-500 to-indigo-600 shadow-purple-500/20';
      case 'music': return 'from-emerald-500 to-teal-600 shadow-emerald-500/20';
      case 'productivity': return 'from-violet-500 to-cyan-600 shadow-violet-500/20';
      default: return 'from-violet-500 to-fuchsia-600 shadow-violet-500/20';
    }
  };

  const brandListVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const brandCardVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    show: { opacity: 1, x: 0, scale: 1 },
    hover: { 
      y: -8, 
      scale: 1.03,
      boxShadow: "0 20px 30px rgba(0,0,0,0.4), 0 0 25px rgba(255,255,255,0.1)",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  if (category === 'discover' && !selectedBrand) {
    return (
      <div className="w-full max-w-md bg-secondary/40 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl">
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Subscription Hub
        </h2>
        <p className="text-white/60 text-sm">
          Select a category quadrant using the sidebar or planet map to explore custom channels and curated packs.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-lg relative z-20 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {!selectedBrand ? (
          // BRANDS LIST
          <motion.div
            key="brands-list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-secondary/45 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Quadrant Category</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white capitalize tracking-tight mt-0.5">
                  {category} Space
                </h2>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <Tv className="w-6 h-6 text-white/80" />
              </div>
            </div>

            {loadingBrands ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-white/40 text-sm">Scanning sector for active channels...</p>
              </div>
            ) : !brands || brands.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-white/5 border border-white/5 border-dashed">
                <p className="text-white/40 text-sm italic mb-2">No active channels in this quadrant.</p>
                <p className="text-xs text-white/30">An admin can initialize dynamic services via the Analytics Space.</p>
              </div>
            ) : (
              <motion.div 
                variants={brandListVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {brands.map((brand) => (
                  <motion.div
                    key={brand._id}
                    variants={brandCardVariants}
                    whileHover="hover"
                    onClick={() => navigate(`/${category}/${brand._id}`)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer flex items-center justify-between gap-3 transition-all group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {brand.logo ? (
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center font-bold text-white shadow-lg shrink-0`}>
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                          {brand.name}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-1">
                          {brand.description || 'Custom service provider bundle.'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          // PACKS LIST
          <motion.div
            key="packs-list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-secondary/45 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <button 
              type="button"
              onClick={() => navigate(`/${category}`)}
              className="mb-6 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group cursor-pointer pointer-events-auto z-30 relative"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Channels
            </button>

            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              {selectedBrand.logo ? (
                <img 
                  src={selectedBrand.logo} 
                  alt={selectedBrand.name} 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/15 shrink-0"
                />
              ) : (
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${getCategoryColor(category)} flex items-center justify-center font-extrabold text-xl sm:text-2xl text-white shadow-xl shrink-0`}>
                  {selectedBrand.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-white truncate">{selectedBrand.name} Packs</h2>
                <p className="text-xs text-white/50 capitalize">{category} space channel</p>
              </div>
            </div>

            {loadingPacks ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-white/40 text-sm">Retrieving real-time plan metrics...</p>
              </div>
            ) : !packs || packs.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-white/5 border border-white/5 border-dashed">
                <p className="text-white/40 text-sm italic mb-2">No subscription packs configured.</p>
                <p className="text-xs text-white/30">An admin can configure packs under this channel in the Analytics Space.</p>
              </div>
            ) : (
              <div className={`space-y-4 max-h-[min(450px,55dvh)] overflow-y-auto pr-1 custom-scrollbar custom-scrollbar-${category.toLowerCase()}`}>
                {packs.map((pack) => {
                  const discountPercent = Math.round(
                    ((pack.originalPrice - pack.price) / pack.originalPrice) * 100
                  );

                  return (
                    <motion.div
                      key={pack._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md relative overflow-hidden"
                    >
                      {discountPercent > 0 && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider text-white uppercase flex items-center gap-1 shadow-md">
                          <TrendingDown className="w-3. h-3" />
                          Save {discountPercent}%
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-bold text-white mb-1 pr-16">{pack.title}</h3>
                      <p className="text-xs text-white/40 mb-3">{pack.description}</p>

                      <div className="flex flex-wrap items-baseline gap-2 mb-4">
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                          ₹{pack.price}
                        </span>
                        {pack.originalPrice > pack.price && (
                          <span className="text-sm line-through text-white/35">
                            ₹{pack.originalPrice}
                          </span>
                        )}
                        <span className="text-xs text-white/40 flex items-center gap-1 ml-1 bg-white/5 px-2 py-0.5 rounded-full">
                          <Clock className="w-3. h-3 text-white/50" />
                          {pack.validity}
                        </span>
                      </div>

                      {pack.features && pack.features.length > 0 && (
                        <div className="space-y-2 mb-5">
                          {pack.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-white/70">
                              <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-emerald-400" />
                              </div>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => handleSubscribe(pack)}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer text-center text-sm"
                      >
                        Acquire Access
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
