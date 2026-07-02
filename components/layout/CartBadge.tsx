'use client';

import { useCartStore } from '@/store/cart';

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  if (total === 0) return null;

  return (
    <span
      className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1 shadow-sm shadow-primary/30"
      aria-label={`Cart has ${total} items`}
    >
      {total > 99 ? '99+' : total}
    </span>
  );
}
