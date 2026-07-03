import Link from 'next/link';
import type { Metadata } from 'next';
import type { Product } from '@/types/index';
import Container from '@/components/layout/Container';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import { productApi } from '@/lib/api';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const result = await productApi.getProducts({ limit: 200 });
    return result.data.map((product) => ({
      id: String(product.id),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await productApi.getProductById(id);
    return {
      title: product.title,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: product.title,
        description: product.description?.slice(0, 160),
        images: product.thumbnail ? [{ url: product.thumbnail }] : [],
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product: Product | null = null;
  let error = false;

  try {
    product = await productApi.getProductById(id);
  } catch {
    error = true;
  }

  if (!product || error) {
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
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 mb-2 text-sm text-muted-foreground/70 hover:text-primary transition-colors no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>
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
        <span className="text-foreground/60 font-medium truncate min-w-0 max-w-50 max-sm:max-w-30">
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
