import { Product } from '@/types/index';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}