'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { ShoppingCart, LogOut, LogIn, User, Menu, X, Store, Search } from 'lucide-react';
import Container from './Container';
import CartBadge from './CartBadge';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (searchQuery) {
      hasInteracted.current = true;
    }
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
    } else if (debouncedSearch === '' && hasInteracted.current) {
      router.push('/products');
    }
  }, [debouncedSearch, router]);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <Container className="flex items-center justify-between h-16 gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground no-underline whitespace-nowrap hover:text-primary transition-colors"
        >
          <Store className="w-5 h-5 text-primary" />
          ShopHub
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="hidden max-md:flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation */}
        <nav
          className={`flex items-center gap-1 flex-1 ml-8 max-md:absolute max-md:top-16 max-md:left-3 max-md:right-3 max-md:flex-col max-md:gap-1 max-md:p-3 max-md:bg-card max-md:border max-md:border-border/60 max-md:rounded-2xl max-md:shadow-xl max-md:max-h-0 max-md:overflow-hidden max-md:transition-all max-md:duration-300 max-md:z-50 ${
            mobileMenuOpen ? 'max-md:max-h-[500px] max-md:overflow-y-auto' : ''
          }`}
        >
          <div className="flex-1 max-w-md max-md:w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5"
              />
            </div>
          </div>

          <div className="flex-1 max-md:hidden" />

          <div className="flex items-center gap-2 max-md:flex-col max-md:w-full max-md:pt-2 max-md:border-t max-md:border-border/40 max-md:mt-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-muted/80 rounded-lg text-sm text-foreground/80 max-md:w-full max-md:justify-center">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all max-md:w-full max-md:justify-center"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all max-md:w-full max-md:justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary no-underline rounded-lg hover:bg-primary/90 transition-all max-md:w-full max-md:justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <Link
            href="/cart"
            className="relative flex items-center p-2 text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingCart className="w-5 h-5" />
            <CartBadge />
          </Link>
        </nav>
      </Container>
    </header>
  );
}
