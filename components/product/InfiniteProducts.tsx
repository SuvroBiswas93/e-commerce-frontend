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

  // Reset products when search params change
  useEffect(() => {
    setProducts(initialProducts);
    setMeta(initialMeta);
    setError('');
  }, [paramsStr, initialProducts, initialMeta]);

  const loadMore = useCallback(async () => {
    if (isLoading || !metaRef.current.hasMore) return;

    setIsLoading(true);
    try {
      const sp = new URLSearchParams(paramsStr);
      const params: Record<string, any> = {
        page: metaRef.current.page + 1,
        limit: metaRef.current.limit,
      };

      if (sp.get('search')) params.search = sp.get('search');
      if (sp.get('category')) params.category = sp.get('category');
      if (sp.get('minPrice')) params.minPrice = sp.get('minPrice');
      if (sp.get('maxPrice')) params.maxPrice = sp.get('maxPrice');
      if (sp.get('sort')) params.sort = sp.get('sort');

      const result = await productApi.getProducts(params);
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
  }, [paramsStr, isLoading]);

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
        <div ref={sentinelRef} className="mt-8 flex justify-center">
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
