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

  const authSection = (mobile: boolean) => {
    const baseClass = mobile
      ? 'flex items-center gap-2 px-3.5 py-2 text-sm font-medium w-full justify-center'
      : 'flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium';

    if (isAuthenticated && user) {
      return (
        <>
          <div className={`${baseClass} bg-muted/80 rounded-lg text-foreground/80`}>
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-30">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className={`${baseClass} text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all`}
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Logout</span>
          </button>
        </>
      );
    }

    return (
      <>
        <Link
          href="/auth/login"
          className={`${baseClass} text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all`}
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          <LogIn className="w-3.5 h-3.5 shrink-0" />
          <span>Login</span>
        </Link>
        <Link
          href="/auth/register"
          className={`${baseClass} px-4 font-semibold text-primary-foreground bg-primary no-underline rounded-lg hover:bg-primary/90 transition-all${mobile ? ' text-center' : ''}`}
          onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
        >
          Sign Up
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <Container className="flex items-center justify-between h-16 gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground no-underline whitespace-nowrap hover:text-primary transition-colors shrink-0"
        >
          <Store className="w-5 h-5 text-primary shrink-0" />
          <span className="hidden sm:inline">ShopHub</span>
        </Link>

        {/* Search - always visible */}
        <div className="flex-1 max-w-md max-sm:max-w-none">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-muted/30 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5"
            />
          </div>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {authSection(false)}
        </div>

        {/* Cart - always visible */}
        <Link
          href="/cart"
          className="relative flex items-center p-2 text-foreground/70 no-underline rounded-lg hover:text-foreground hover:bg-muted/80 transition-all shrink-0"
        >
          <ShoppingCart className="w-5 h-5" />
          <CartBadge />
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </Container>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-64 border-b border-border/40' : 'max-h-0'
        }`}
      >
        <Container className="py-3 flex flex-col gap-2">
          {authSection(true)}
        </Container>
      </div>
    </header>
  );
}
