export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ArticleCard {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  featuredImage?: string;
  category: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  severity?: Severity;
  isBreaking?: boolean;
  isFeatured?: boolean;
  cveIds?: string[];
  views?: number;
  sources?: Array<{ name: string; title: string; url: string; publishedAt?: string }>;
}

export interface ArticleDetail extends ArticleCard {
  content: string;
  keyTakeaways?: string[];
  seoTitle?: string;
  seoDescription?: string;
  mitigation?: string;
  securityDetails?: string;
  affectedProducts?: string[];
  affectedVendors?: string[];
  cvssScore?: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: init?.cache,
    next: init && 'next' in init ? (init as { next?: { revalidate?: number } }).next : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export async function serverGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}
