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
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const isFirstRender = useRef(true);

  const buildParams = useCallback(
    (page: number) => {
      const sp = new URLSearchParams(paramsStr);
      const params: Record<string, any> = {
        page,
        limit: 12,
      };
      if (sp.get('search')) params.search = sp.get('search');
      if (sp.get('category')) params.category = sp.get('category');
      if (sp.get('minPrice')) params.minPrice = sp.get('minPrice');
      if (sp.get('maxPrice')) params.maxPrice = sp.get('maxPrice');
      if (sp.get('sort')) params.sort = sp.get('sort');
      return params;
    },
    [paramsStr]
  );

  // Fetch products when URL params change on client navigation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsLoading(true);
    setError('');

    productApi
      .getProducts(buildParams(1))
      .then((result) => {
        setProducts(result.data);
        setMeta(
          result.meta || { page: 1, limit: 12, total: 0, hasMore: false }
        );
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setIsLoading(false));
  }, [paramsStr, buildParams]);

  // Fetch initial data on mount if SSR didn't provide it
  useEffect(() => {
    if (initialProducts.length === 0) {
      setIsLoading(true);
      productApi
        .getProducts(buildParams(1))
        .then((result) => {
          setProducts(result.data);
          setMeta(
            result.meta || { page: 1, limit: 12, total: 0, hasMore: false }
          );
        })
        .catch(() => setError('Failed to load products'))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || !metaRef.current.hasMore) return;

    setIsLoading(true);
    try {
      const result = await productApi.getProducts(
        buildParams(metaRef.current.page + 1)
      );
      setProducts((prev) => [...prev, ...result.data]);

      setMeta((prev) => ({
        ...prev,
        page: prev.page + 1,
        hasMore: result.meta?.hasMore ?? false,
      }));
    } catch (err) {
      setError('Failed to load more products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [buildParams, isLoading]);

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
