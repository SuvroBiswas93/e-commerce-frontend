'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { productApi } from '@/lib/api';
import Container from '@/components/layout/Container';
import ProductFilters from '@/components/product/ProductFilters';
import InfiniteProducts from '@/components/product/InfiniteProducts';
import Skeleton from '@/components/common/Skeleton';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<{
    products: any[];
    meta: any;
    categories: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsStr = searchParams.toString();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams(paramsStr);
      const params: Record<string, any> = {
        page: sp.get('page') ? parseInt(sp.get('page')!) : 1,
        limit: 12,
      };

      if (sp.get('search')) params.search = sp.get('search');
      if (sp.get('category')) params.category = sp.get('category');
      if (sp.get('minPrice')) params.minPrice = sp.get('minPrice');
      if (sp.get('maxPrice')) params.maxPrice = sp.get('maxPrice');
      if (sp.get('sort')) params.sort = sp.get('sort');

      const [productResult, categories] = await Promise.all([
        productApi.getProducts(params),
        productApi.getCategories(),
      ]);

      setData({
        products: productResult.data,
        meta: productResult.meta || {
          page: params.page,
          limit: params.limit,
          total: 0,
          hasMore: false,
        },
        categories,
      });
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [paramsStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          {data?.categories && data.categories.length > 0 && (
            <ProductFilters categories={data.categories} />
          )}
        </div>

        <main className="min-h-[400px]">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          ) : loading ? (
            <Skeleton variant="card" count={12} />
          ) : data ? (
            <InfiniteProducts
              initialProducts={data.products}
              initialMeta={data.meta}
            />
          ) : null}
        </main>
      </div>
    </Container>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Container className="py-8 max-md:py-5"><Skeleton variant="card" count={12} /></Container>}>
      <ProductsContent />
    </Suspense>
  );
}
