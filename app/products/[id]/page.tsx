'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productApi } from '@/lib/api';
import { Product } from '@/types/index';
import Container from '@/components/layout/Container';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import Skeleton from '@/components/common/Skeleton';
import { ChevronRight, Home } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    setError(false);
    productApi
      .getProductById(params.id)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <Container className="py-8 max-md:py-5">
        <Skeleton variant="detail" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-8 max-md:py-5">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mb-2">
            <Home className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl max-md:text-xl font-bold text-foreground tracking-tight">
            Product Not Found
          </h1>
          <p className="text-sm text-muted-foreground/80 max-w-sm">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-all mt-2"
          >
            Back to Products
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-md:py-5">
      <nav className="flex items-center gap-1.5 mb-6 max-md:mb-4 text-sm text-muted-foreground/70 flex-wrap">
        <Link
          href="/"
          className="text-muted-foreground/70 no-underline hover:text-primary transition-colors shrink-0"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          href="/products"
          className="text-muted-foreground/70 no-underline hover:text-primary transition-colors shrink-0"
        >
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-foreground/60 font-medium truncate min-w-0 max-w-[200px] max-sm:max-w-[120px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-10 max-md:gap-6 max-sm:gap-5">
        <ProductGallery image={product.thumbnail} name={product.title} />
        <ProductInfo product={product} />
      </div>
    </Container>
  );
}
