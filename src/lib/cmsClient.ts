import { createClient } from '@supabase/supabase-js';

// CMS Panel Supabase - ayrı instance (site'ın kendi Supabase'inden bağımsız)
const cmsUrl = import.meta.env.VITE_CMS_SUPABASE_URL || '';
const cmsAnonKey = import.meta.env.VITE_CMS_SUPABASE_ANON_KEY || '';
const cmsSiteId = import.meta.env.VITE_CMS_SITE_ID || 'silifke_teknoloji';

export const isCmsConfigured = !!(cmsUrl && cmsAnonKey);

const cmsSupabase = isCmsConfigured
  ? createClient(cmsUrl, cmsAnonKey)
  : null;

export interface CmsCollectionItem {
  id: string;
  collection_id: string;
  data: Record<string, string>;
  sort_order: number;
}

/**
 * Belirli bir koleksiyonun published kayıtlarını çeker.
 * RLS politikası sayesinde sadece status='published' ve is_active=true olanlar gelir.
 */
export async function fetchCollectionItems(
  collectionSlug: string
): Promise<CmsCollectionItem[]> {
  if (!cmsSupabase) {
    console.warn('CMS Supabase not configured');
    return [];
  }

  try {
    // Önce koleksiyonun ID'sini bul
    const { data: collections, error: colError } = await cmsSupabase
      .from('collections')
      .select('id')
      .eq('site_id', cmsSiteId)
      .eq('slug', collectionSlug)
      .eq('is_active', true)
      .limit(1);

    if (colError || !collections?.length) {
      console.error('Collection not found:', collectionSlug, colError);
      return [];
    }

    const collectionId = collections[0].id;

    // Kayıtları çek (RLS: sadece published + is_active)
    const { data: items, error: itemsError } = await cmsSupabase
      .from('collection_items')
      .select('id, collection_id, data, sort_order')
      .eq('collection_id', collectionId)
      .eq('site_id', cmsSiteId)
      .order('sort_order', { ascending: true });

    if (itemsError) {
      console.error('Error fetching collection items:', itemsError);
      return [];
    }

    return (items || []) as CmsCollectionItem[];
  } catch (err) {
    console.error('CMS fetch error:', err);
    return [];
  }
}
