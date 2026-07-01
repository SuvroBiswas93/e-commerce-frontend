import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/index';
import { formatPrice } from '@/utils/currency';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const rating = product.rating || 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-gray-400 hover:-translate-y-1 no-underline text-inherit"
    >
      <div className="relative w-full pb-[100%] overflow-hidden bg-gray-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white font-semibold text-sm">
            Out of Stock
          </div>
        )}
        <div className="absolute inset-x-4 top-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-2.5 py-1 bg-white text-black text-xs font-medium rounded-full shadow-sm">
            {product.category.name}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-2">
        <h3 className="text-sm font-semibold text-black leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(rating)
                    ? 'fill-black text-black'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-base font-bold text-black mt-auto pt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}