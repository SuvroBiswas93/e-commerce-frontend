'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from './ProductGrid';
import { productApi } from '@/lib/api';
import { Product } from '@/types/index';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import Loader from '@/components/common/Loader';
import Skeleton from '@/components/common/Skeleton';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

interface InfiniteProductsProps {
  initialProducts: Product[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export default function InfiniteProducts({
  initialProducts,
  initialMeta,
}: InfiniteProductsProps) {
  const searchParams = useSearchParams();
  const paramsStr = searchParams.toString();
  const [products, setProducts] = useState(() => {
    const seen = new Set<string>();
    return initialProducts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  });
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const isLoadingRef = useRef(false);

  const buildParams = useCallback(
    (page: number) => {
      const sp = new URLSearchParams(paramsStr);
      const params: Record<string, any> = {
        page,
        limit: 12,
      };
      if (sp.get('search')) params.search = sp.get('search');
      if (sp.get('category')) params.category = sp.get('category');
      const minP = sp.get('minPrice');
      const maxP = sp.get('maxPrice');
      if (minP && maxP && Number(minP) <= Number(maxP)) {
        params.minPrice = minP;
        params.maxPrice = maxP;
      }
      if (sp.get('sort')) params.sort = sp.get('sort');
      return params;
    },
    [paramsStr]
  );

  const buildParamsRef = useRef(buildParams);
  buildParamsRef.current = buildParams;

  // Fetch initial data on mount if SSR didn't provide it
  useEffect(() => {
    if (initialProducts.length === 0) {
      let cancelled = false;
      setIsLoading(true);
      productApi
        .getProducts(buildParams(1))
        .then((result) => {
          if (cancelled) return;
          const seen = new Set<string>();
          setProducts(result.data.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          }));
          setMeta(
            result.meta || { page: 1, limit: 12, total: 0, hasMore: false }
          );
        })
        .catch(() => {
          if (cancelled) return;
          setError('Failed to load products');
        })
        .finally(() => {
          if (cancelled) return;
          setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !metaRef.current.hasMore) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const result = await productApi.getProducts(
        buildParamsRef.current(metaRef.current.page + 1)
      );
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const seen = new Set<string>();
        const fresh = result.data.filter((p) => {
          if (existingIds.has(p.id) || seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        return [...prev, ...fresh];
      });

      setMeta((prev) => ({
        ...prev,
        page: prev.page + 1,
        hasMore: result.meta?.hasMore ?? false,
      }));
    } catch (err) {
      setError('Failed to load more products');
      console.error(err);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const { sentinelRef } = useInfiniteScroll(loadMore);

  if (error && products.length === 0) {
    return (
      <ErrorState
        title="Failed to load products"
        description="There was an error loading products. Please try again."
        action={{ label: 'Try Again', onClick: () => window.location.reload() }}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description={`${
          searchParams.size > 0
            ? 'Try adjusting your filters'
            : 'Check back soon!'
        }`}
        action={
          searchParams.size > 0
            ? { label: 'Clear Filters', href: '/products' }
            : undefined
        }
      />
    );
  }

  return (
    <div>
      <ProductGrid products={products} />

      {meta.hasMore && (
        <div ref={sentinelRef} className="mt-8 flex justify-center min-h-px">
          {isLoading && <Loader />}
        </div>
      )}

      {isLoading && (
        <div className="mt-8">
          <Skeleton variant="card" count={4} />
        </div>
      )}
    </div>
  );
}
