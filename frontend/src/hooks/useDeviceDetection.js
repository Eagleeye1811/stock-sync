import { useState, useEffect } from 'react';

/**
 * Custom hook for device detection and responsive behavior
 * Useful for adapting UI based on device type (mobile vs desktop)
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: window.innerHeight,
      });
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

/**
 * Check if device is touch-enabled
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  return isTouch;
};

/**
 * Get optimal layout based on device and user role
 * @param {string} userRole - User's role (ADMIN, MANAGER, STAFF)
 * @param {boolean} isMobile - Is mobile device
 * @returns {string} Layout type: 'mobile-card', 'desktop-table', 'tablet-grid'
 */
export const getOptimalLayout = (userRole, isMobile) => {
  // STAFF users get mobile-optimized layout regardless of device (can be overridden)
  if (userRole === 'STAFF' && isMobile) {
    return 'mobile-card';
  }
  
  if (isMobile) {
    return 'mobile-card';
  }
  
  return 'desktop-table';
};

