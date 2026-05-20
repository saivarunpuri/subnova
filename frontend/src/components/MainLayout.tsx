import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useUIStore } from '../store/uiStore';
import { SubscriptionUniverse } from './SubscriptionUniverse';
import { HeroSequence } from './HeroSequence';
import { BundiAssistant } from '../chatbot/BundiAssistant';
import { Sidebar } from './Sidebar';
import { DashboardSpace } from '../pages/DashboardSpace';
import { AnalyticsSpace } from '../pages/AnalyticsSpace';
import { PaymentFlow } from '../features/payment/PaymentFlow';
import { CategoryOverlay } from './CategoryOverlay';
import { usePackById } from '../hooks/useOTT';

import { TopLogo } from './TopLogo';

export const MainLayout: React.FC = () => {
  const [launched, setLaunched] = useState(false);
  const activeSpace = useUIStore((state) => state.activeSpace);
  const setActiveSpace = useUIStore((state) => state.setActiveSpace);
  const { setPaymentOpen, setSelectedBundle } = useUIStore();
  
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { packId } = useParams<{ packId?: string }>();

  // Fetch pack details if visiting a specific pack checkout URL
  const { data: packDetails } = usePackById(packId);

  // Sync URL changes to UIStore activeSpace
  React.useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const primarySegment = segments[0] || 'discover';

    const validSpaces = [
      'discover',
      'entertainment',
      'education',
      'creator',
      'music',
      'productivity',
      'dashboard',
      'analytics'
    ];

    if (validSpaces.includes(primarySegment)) {
      setActiveSpace(primarySegment as any);
    }
  }, [pathname, setActiveSpace]);

  // Synchronize packDetails fetch with payment flow state
  React.useEffect(() => {
    if (packDetails && packId) {
      const brandName = typeof packDetails.brand === 'object' && packDetails.brand ? (packDetails.brand as any).name : 'Service Provider';
      const brandCategory = typeof packDetails.brand === 'object' && packDetails.brand ? (packDetails.brand as any).category : 'discover';

      setSelectedBundle({
        _id: packDetails._id,
        title: `${brandName} - ${packDetails.title}`,
        category: brandCategory,
        apps: [brandName],
        bundlePrice: packDetails.price,
        originalPrice: packDetails.originalPrice,
      });
      setPaymentOpen(true);
    }
  }, [packDetails, packId, setSelectedBundle, setPaymentOpen]);

  // Enforce authentication for protected areas ONLY (Dashboard, Analytics, checkout packs)
  // Discovery/category pages are publicly accessible without login
  React.useEffect(() => {
    if (!isAuthenticated || !token) {
      const isProtected = activeSpace === 'dashboard' || activeSpace === 'analytics' || pathname.startsWith('/pack/');
      if (isProtected) {
        sessionStorage.setItem('redirectAfterLogin', pathname);
        navigate('/login');
      }
      // Discover, entertainment, education, music, creator, productivity
      // are all public — no redirect needed
    }
  }, [activeSpace, isAuthenticated, token, navigate, pathname]);


  // Role-based redirects for dashboard/analytics spaces
  React.useEffect(() => {
    if (!isAuthenticated || !token || !user) return;

    if (user.role === 'admin' && activeSpace === 'dashboard') {
      navigate('/analytics', { replace: true });
    } else if (user.role !== 'admin' && activeSpace === 'analytics') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, token, user, activeSpace, navigate]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-primary text-text-main" style={{ background: '#050816' }}>
      {!launched ? (
        <HeroSequence onComplete={() => setLaunched(true)} />
      ) : (
        <>
          {/* Background 3D Universe */}
          {activeSpace !== 'analytics' && (
            <div className="absolute inset-0 z-0 pointer-events-auto">
              <SubscriptionUniverse />
            </div>
          )}

          {/* Foreground UI Overlays */}
          <div className="absolute inset-0 z-10 pointer-events-none flex min-w-0">
            {/* Anchored Brand Identity */}
            <TopLogo />

            {/* Sidebar acts as navigation */}
            <div className="pointer-events-auto">
              <Sidebar />
            </div>

            {/* Main Content Area based on space */}
            <main className="flex-1 relative min-w-0">
              {activeSpace === 'dashboard' && (
                <div className="pointer-events-auto w-full h-full pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-40 overflow-y-auto custom-scrollbar custom-scrollbar-dashboard">
                  <DashboardSpace />
                </div>
              )}
              {activeSpace === 'analytics' && (
                <div className="pointer-events-auto w-full h-full pt-24 sm:pt-28 px-3 sm:px-6 lg:px-8 pb-32 sm:pb-40 overflow-y-auto custom-scrollbar custom-scrollbar-analytics">
                  <AnalyticsSpace />
                </div>
              )}
              {['entertainment', 'education', 'music', 'productivity', 'creator', 'discover'].includes(activeSpace) && (
                <div className={`pointer-events-none w-full h-full p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 pb-32 sm:pb-40 flex items-start sm:items-center justify-center lg:justify-end lg:pr-24 overflow-y-auto custom-scrollbar custom-scrollbar-${activeSpace}`}>
                  <CategoryOverlay category={activeSpace} />
                </div>
              )}
            </main>
          </div>

          {/* Floating UI */}
          <div className="pointer-events-auto">
            <BundiAssistant />
            <PaymentFlow />
          </div>
        </>
      )}
    </div>
  );
};
