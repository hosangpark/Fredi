import { ReactNode, useLayoutEffect } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ children }: { children: ReactNode }) {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  return <>{children}</>;
}

export default ScrollToTop;
