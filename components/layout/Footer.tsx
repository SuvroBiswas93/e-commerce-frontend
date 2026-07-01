import Container from './Container';
import Link from 'next/link';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-20">
      <Container className="py-14">
        <div className="grid grid-cols-4 max-md:grid-cols-1 gap-10 max-md:gap-8">
          <div className="col-span-1 max-md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">ShopHub</h3>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs">
              Your favorite e-commerce destination for quality products at unbeatable prices.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-foreground/60 mb-4 tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/products" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/cart" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Cart</Link></li>
              <li><Link href="/auth/login" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-foreground/60 mb-4 tracking-widest">Support</h4>
            <ul className="space-y-2.5">
              <li><a href="#contact" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#shipping" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-foreground/60 mb-4 tracking-widest">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#privacy" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#returns" className="text-sm text-muted-foreground/80 no-underline hover:text-primary transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-border/30 bg-muted/30">
        <Container className="py-5">
          <p className="text-xs text-muted-foreground/60 text-center">
            &copy; 2026 ShopHub. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
