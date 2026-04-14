import { useState, useEffect } from 'react';
import { fetchCollectionItems, type CmsCollectionItem } from '../lib/cmsClient';

interface UseCmsCollectionResult {
  items: CmsCollectionItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Belirli bir CMS koleksiyonunun verilerini çeken React hook.
 * Sayfa mount olduğunda bir kere çeker ve cache'ler.
 */
export function useCmsCollection(collectionSlug: string): UseCmsCollectionResult {
  const [items, setItems] = useState<CmsCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchCollectionItems(collectionSlug);
        if (!cancelled) {
          setItems(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'CMS fetch failed');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [collectionSlug]);

  return { items, loading, error };
}
