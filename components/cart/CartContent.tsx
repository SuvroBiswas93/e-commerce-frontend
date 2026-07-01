'use client';

import { useCartStore } from '@/store/cart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyState from '@/components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

export default function CartContent() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Start shopping to add items to your cart"
        action={{ label: 'Start Shopping', href: '/products' }}
        icon={<ShoppingBag className="w-12 h-12" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-[1fr_380px] max-lg:grid-cols-1 gap-8 max-lg:gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Cart Items ({items.length})
          </h2>
          <button
            onClick={clearCart}
            className="px-4 py-2 text-sm font-medium text-muted-foreground/70 bg-muted/50 border border-border/40 rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
      </div>

      <aside className="h-fit">
        <CartSummary />
      </aside>
    </div>
  );
}
