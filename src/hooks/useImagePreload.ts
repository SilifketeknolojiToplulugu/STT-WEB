import { useEffect, useState } from 'react';

interface UseImagePreloadOptions {
  priority?: boolean;
  highPriorityCount?: number;
}

export const useImagePreload = (imageUrls: string[], options: UseImagePreloadOptions = {}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { priority = false, highPriorityCount } = options;

  useEffect(() => {
    if (!imageUrls.length) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;
    let isMounted = true;

    const preloadImage = (url: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          if (!isMounted) {
            resolve(url);
            return;
          }

          setLoadedImages(prev => new Set([...prev, url]));
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
          
          resolve(url);
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          loadedCount++;
          
          if (!isMounted) {
            reject(new Error(`Failed to load image: ${url}`));
            return;
          }

          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
          
          setHasError(true);
          reject(new Error(`Failed to load image: ${url}`));
        };

        // Set loading priority
        if (priority) {
          img.loading = 'eager';
        }
        
        img.src = url;
      });
    };

    // Preload images with optional batching for performance
    const preloadBatch = async () => {
      try {
        if (priority) {
          const immediateCount = Math.min(
            imageUrls.length,
            Math.max(1, highPriorityCount ?? 3)
          );

          const immediateImages = imageUrls.slice(0, immediateCount);
          const deferredImages = imageUrls.slice(immediateCount);

          await Promise.allSettled(immediateImages.map(preloadImage));

          for (const deferredUrl of deferredImages) {
            await preloadImage(deferredUrl);
          }
        } else {
          // Load non-priority images in smaller batches
          const batchSize = 3;
          for (let i = 0; i < imageUrls.length; i += batchSize) {
            const batch = imageUrls.slice(i, i + batchSize);
            await Promise.allSettled(batch.map(preloadImage));
            
            // Small delay between batches to prevent overwhelming the browser
            if (i + batchSize < imageUrls.length) {
              await new Promise(resolve => setTimeout(resolve, 75));
            }
          }
        }
      } catch (error) {
        console.error('Error preloading images:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    preloadBatch();
    return () => {
      isMounted = false;
    };
  }, [imageUrls, priority, highPriorityCount]);

  return {
    loadedImages,
    isLoading,
    hasError,
    isImageLoaded: (url: string) => loadedImages.has(url)
  };
};

export default useImagePreload;
