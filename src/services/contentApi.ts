export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: {
    body: string;
  };
  business: {
    name: string;
    domain: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kok-os.com';
const DOMAIN = 'silifketeknoloji.org';

export const fetchPageContent = async (slug: string): Promise<PageContent | null> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/content`);
    url.searchParams.append('domain', DOMAIN);
    url.searchParams.append('slug', slug);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 60 seconds (similar to revalidate: 60 in Next.js)
      // Note: This relies on the browser's cache or if used in a build step. 
      // specific caching strategies might differ based on where this is called.
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as PageContent;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

export const fetchPages = async (): Promise<PageContent[]> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/content`);
    url.searchParams.append('domain', DOMAIN);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
};
