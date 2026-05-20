import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LoginSpace } from './pages/LoginSpace';
import { MainLayout } from './components/MainLayout';
import { logout } from './store/authSlice';
import type { RootState } from './store/store';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loginTimestamp } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && loginTimestamp) {
      const sessionDuration = 20 * 60 * 1000; // 20 minutes
      const elapsed = Date.now() - loginTimestamp;
      const timeLeft = sessionDuration - elapsed;

      if (timeLeft <= 0) {
        dispatch(logout());
      } else {
        const timer = setTimeout(() => {
          dispatch(logout());
        }, timeLeft);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loginTimestamp, dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto bg-primary overflow-y-auto">
            <LoginSpace />
          </div>
        }
      />
      <Route path="/" element={<MainLayout />} />
      <Route path="/dashboard" element={<MainLayout />} />
      <Route path="/analytics" element={<MainLayout />} />
      <Route path="/pack/:packId" element={<MainLayout />} />
      <Route path="/:category" element={<MainLayout />} />
      <Route path="/:category/:brandId" element={<MainLayout />} />
      <Route path="*" element={<MainLayout />} />
    </Routes>
  );
}

export default App;
