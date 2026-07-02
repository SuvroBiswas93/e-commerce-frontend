'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/index';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/utils/currency';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  const total = item.price * item.quantity;

  return (
    <div className="relative grid grid-cols-[100px_1fr_auto] gap-4 p-4 bg-card border border-border/60 rounded-2xl transition-all hover:shadow-sm hover:border-border/80 max-md:grid-cols-[80px_1fr] max-md:gap-3 max-md:p-3">
      <Link href={`/products/${item.productId}`} className="no-underline">
        <div className="relative w-25 h-25 overflow-hidden rounded-xl bg-muted/60 max-md:w-20 max-md:h-20">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
      </Link>

      <div className="flex flex-col justify-center gap-1.5 min-w-0 max-md:col-start-2">
        <Link
          href={`/products/${item.productId}`}
          className="no-underline text-inherit"
        >
          <h3 className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground/70">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center border border-border/50 rounded-lg overflow-hidden bg-background">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="p-1.5 bg-none border-none border-r border-border/30 cursor-pointer text-foreground/60 hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                if (val >= 1) {
                  updateQuantity(item.productId, val);
                }
              }}
              className="w-10 text-center border-none bg-none text-foreground font-semibold text-xs focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [[type=number]]:appearance-none"
              aria-label={`Quantity for ${item.name}`}
            />
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="p-1.5 bg-none border-none border-l border-border/30 cursor-pointer text-foreground/60 hover:bg-muted/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 bg-none border-none cursor-pointer text-muted-foreground/40 hover:text-destructive transition-colors flex items-center justify-center rounded-lg hover:bg-destructive/5"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center">
        <p className="text-sm font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1 max-md:hidden">Total</p>
        <p className="text-base font-bold text-foreground">{formatPrice(total)}</p>
      </div>
    </div>
  );
}
