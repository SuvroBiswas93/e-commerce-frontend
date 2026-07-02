'use client';

import { useState } from 'react';
import { Product, CartItem } from '@/types/index';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/utils/currency';
import { Star, Plus, Minus, ShoppingCart, Check, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const rating = product.rating || 0;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity,
    };

    addItem(cartItem);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-md:gap-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-muted-foreground text-xs font-medium rounded-full mb-3">
          <Package className="w-3 h-3" />
          {product.category.name}
        </div>
        <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-foreground tracking-tight">
          {product.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground/25'
              }`}
            />
          ))}
        </div>
        {rating > 0 && (
          <span className="text-sm text-muted-foreground/70">
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      <p className="text-3xl max-md:text-2xl font-bold text-foreground">
        {formatPrice(product.price)}
      </p>

      <p className="text-sm text-muted-foreground/80 leading-relaxed">
        {product.description}
      </p>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
        <div className="flex flex-col gap-1.5 p-4 max-sm:p-3 bg-muted/50 rounded-xl">
          <span className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">Category</span>
          <span className="text-sm font-medium text-foreground">{product.category.name}</span>
        </div>
        <div className="flex flex-col gap-1.5 p-4 max-sm:p-3 bg-muted/50 rounded-xl">
          <span className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">Availability</span>
          <span className={`text-sm font-medium ${inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of Stock'}
          </span>
        </div>
      </div>

      {inStock && (
        <div className="flex gap-3 max-md:flex-col">
          <div className="flex items-center border border-border/60 rounded-xl overflow-hidden bg-background max-md:w-full max-md:justify-between">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-3 max-sm:p-4 bg-none border-none border-r border-border/40 cursor-pointer text-foreground/70 hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                if (val >= 1 && val <= product.stock) {
                  setQuantity(val);
                }
              }}
              min="1"
              max={product.stock}
              className="flex-1 text-center border-none bg-none text-foreground font-semibold px-2 w-16 text-base max-sm:text-sm focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [[type=number]]:appearance-none"
              aria-label="Product quantity"
            />
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
              className="p-3 max-sm:p-4 bg-none border-none border-l border-border/40 cursor-pointer text-foreground/70 hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 max-md:w-full p-3 max-sm:p-4 border-none rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200 text-sm max-sm:text-base ${
              isAdded
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isAdded ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : (
              <ShoppingCart className="w-5 h-5 shrink-0" />
            )}
            <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      )}

      {!inStock && (
        <div className="p-4 bg-destructive/5 border border-destructive/20 text-destructive rounded-xl text-center font-medium text-sm">
          This product is currently out of stock
        </div>
      )}
    </div>
  );
}
