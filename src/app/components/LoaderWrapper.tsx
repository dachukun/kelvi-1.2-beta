'use client';

import React, { useEffect, useState } from 'react';
import Loader from '../dashboard/components/Loader';

interface LoaderWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
}

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({ children, loading = false }) => {
  const [showLoader, setShowLoader] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        if (!loading) setShowLoader(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  if (showLoader) {
    return (
      <div className="min-h-screen flowing-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoaderWrapper;