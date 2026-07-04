import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import ProductFilters from '@/components/product/ProductFilters';
import InfiniteProducts from '@/components/product/InfiniteProducts';
import Skeleton from '@/components/common/Skeleton';
import { productApi, setServerToken } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Browse Products',
  description: 'Browse our extensive collection of products with advanced filtering and search capabilities.',
  openGraph: {
    title: 'Browse Products',
    description: 'Browse our extensive collection of products with advanced filtering and search capabilities.',
  },
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) redirect('/auth/login');
  setServerToken(token);

  const params: Record<string, any> = {
    page: sp.page ? parseInt(String(sp.page)) : 1,
    limit: 12,
  };
  if (sp.search) params.search = String(sp.search);
  if (sp.category) params.category = String(sp.category);
  if (sp.minPrice && sp.maxPrice && Number(sp.minPrice) <= Number(sp.maxPrice)) {
    params.minPrice = String(sp.minPrice);
    params.maxPrice = String(sp.maxPrice);
  }
  if (sp.sort) params.sort = String(sp.sort);

  let products: any[] = [];
  let meta = { page: 1, limit: 12, total: 0, hasMore: false };
  let categories: any[] = [];
  let error = false;

  try {
    const [productResult, cats] = await Promise.all([
      productApi.getProducts(params),
      productApi.getCategories(),
    ]);

    products = productResult.data;
    meta = productResult.meta || { page: params.page, limit: params.limit, total: 0, hasMore: false };
    categories = cats;
  } catch {
    error = true;
  }

  const qs = new URLSearchParams();
  Object.entries(sp).forEach(([key, value]) => {
    if (value) qs.set(key, String(value));
  });
  const filterKey = qs.toString() || 'no-filters';

  return (
    <Container className="py-8 max-md:py-5">
      <div className="mb-8 max-md:mb-6">
        <h1 className="text-3xl max-md:text-2xl font-bold text-foreground tracking-tight">
          Browse Products
        </h1>
        <p className="text-muted-foreground/80 mt-1">
          Discover our amazing collection of products
        </p>
      </div>

      <div className="grid grid-cols-[270px_1fr] max-lg:grid-cols-1 gap-8 max-lg:gap-0">
        <div>
          <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-5 animate-pulse"><div className="h-6 bg-muted rounded w-20 mb-4" /><div className="space-y-3"><div className="h-10 bg-muted rounded" /><div className="h-10 bg-muted rounded" /><div className="h-10 bg-muted rounded" /></div></div>}>
            {categories.length > 0 && <ProductFilters categories={categories} />}
          </Suspense>
        </div>

        <main className="min-h-100">
          <Suspense fallback={<Skeleton variant="card" count={12} />}>
            {error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-destructive font-medium">Failed to load products</p>
              </div>
            ) : (
              <InfiniteProducts
                key={filterKey}
                initialProducts={products}
                initialMeta={meta}
              />
            )}
          </Suspense>
        </main>
      </div>
    </Container>
  );
}
