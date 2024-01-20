import { useState, useEffect, useCallback } from 'react';

function useClientDimensions(dimensionType: 'width' | 'height') {
  const [dimension, setDimension] = useState(
    dimensionType === 'width' ? window.innerWidth : window.innerHeight
  );

  const handleWindowResize = useCallback(() => {
    const newDimension = window[dimensionType as keyof Window];
    setDimension(newDimension);
  }, [dimensionType]);

  useEffect(() => {
    // Check if window is defined (avoid issues during server-side rendering)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, [handleWindowResize]);

  return dimension;
}

export function useClientWidth() {
  return useClientDimensions('width');
}

export function useClientHeight() {
  return useClientDimensions('height');
}
