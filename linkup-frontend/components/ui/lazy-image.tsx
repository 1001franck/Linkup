/**
 * Composant LazyImage pour le chargement différé des images
 * Optimise les performances en chargeant les images seulement quand elles sont visibles
 */

import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: React.ReactNode;
  fallback?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  placeholder, 
  fallback = '/placeholder-image.png',
  className = '',
  ...props 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(imgRef, { threshold: 0.1 });

  useEffect(() => {
    if (isVisible && !isLoaded && !hasError) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
      img.src = src;
    }
  }, [isVisible, src, isLoaded, hasError]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isVisible || (!isLoaded && !hasError) ? (
        placeholder || (
          <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 animate-pulse" />
          </div>
        )
      ) : hasError ? (
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
          {...props}
        />
      )}
    </div>
  );
}
