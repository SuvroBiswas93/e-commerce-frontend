'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/utils/currency';
import { ArrowRight, Shield } from 'lucide-react';

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-sm max-md:mt-6">
      <h2 className="text-lg font-bold text-foreground mb-5">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground/70">Subtotal</span>
          <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground/70">Tax (10%)</span>
          <span className="text-foreground font-medium">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground/70">Shipping</span>
          <span className="text-emerald-600 font-medium">Free</span>
        </div>
      </div>

      <div className="h-px bg-border/50 my-4" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-base font-bold text-foreground">Total</span>
        <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
      </div>

      <button className="w-full py-3 px-4 bg-primary text-primary-foreground border-none rounded-xl font-semibold text-sm cursor-pointer hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2">
        Proceed to Checkout
        <ArrowRight className="w-4 h-4" />
      </button>

      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground/70 no-underline mt-4 hover:text-primary transition-colors"
      >
        Continue Shopping
      </Link>

      <div className="flex items-center justify-center gap-1.5 mt-4 pt-4 border-t border-border/30">
        <Shield className="w-3.5 h-3.5 text-muted-foreground/40" />
        <span className="text-xs text-muted-foreground/40">Secure checkout</span>
      </div>
    </div>
  );
}
