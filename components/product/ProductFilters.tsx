'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category, SortOption } from '@/types/index';
import { useEffect, useState, useRef } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X, ArrowUpDown, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isOpen, setIsOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const hasMounted = useRef(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  useEffect(() => {
    if (hasMounted.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      hasMounted.current = true;
    }
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    params.set('page', '1');
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products', { scroll: false });
  }, [selectedCategory, minPrice, maxPrice, sort, debouncedSearch, router]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setSearchQuery('');
  };

  const hasFilters = selectedCategory || minPrice || maxPrice || searchQuery;
  const filterCount = [selectedCategory, minPrice, maxPrice, searchQuery].filter(Boolean).length;

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryLabel = (isSelected: boolean) =>
    isSelected
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'bg-card text-foreground ring-1 ring-border hover:ring-ring';

  const checkBox = (isSelected: boolean) =>
    isSelected
      ? 'border-primary-foreground bg-primary-foreground text-primary'
      : 'border-border bg-card text-card';

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden flex w-full items-center justify-between gap-2 p-3.5 bg-card border border-border rounded-xl font-medium text-sm cursor-pointer mb-5 hover:bg-muted/50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 text-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </span>
        <span className="flex items-center gap-2.5">
          {hasFilters && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
              {filterCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filter panel */}
      <aside
        className={`flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 text-foreground shadow-sm sticky top-24
          max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-full max-lg:w-75 max-lg:max-w-[85vw]
          max-lg:z-50 max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-0 max-lg:pt-16 max-lg:px-6 max-lg:pb-6
          max-lg:transition-transform max-lg:duration-300 max-lg:ease-in-out
          ${isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <button
          className="lg:hidden fixed top-4 right-4 z-10 flex items-center justify-center w-10 h-10 bg-card border border-border rounded-xl cursor-pointer text-foreground hover:bg-muted transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Filters
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Refine your products</p>
          </div>
          {hasFilters && (
            <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-xs font-semibold lg:hidden">
              {filterCount} active
            </span>
          )}
        </div>

        {/* Search */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Search
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 pl-9 pr-8 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Category */}
        <section className="rounded-xl bg-muted/50 p-3 ring-1 ring-border">
          <button
            type="button"
            onClick={() => setIsCategoryOpen((current) => !current)}
            className="flex w-full items-center justify-between text-left text-base font-bold leading-none text-foreground"
            aria-expanded={isCategoryOpen}
          >
            <span>Category</span>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isCategoryOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="mt-4 flex flex-col gap-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${categoryLabel(!selectedCategory)}`}
              >
                <input
                  type="checkbox"
                  checked={!selectedCategory}
                  onChange={() => handleCategoryChange('')}
                  className="sr-only"
                />
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checkBox(!selectedCategory)}`}>
                  {!selectedCategory && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="truncate">All Products</span>
              </label>

              {visibleCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <label
                    key={cat.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${categoryLabel(isSelected)}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryChange(selectedCategory === cat.slug ? '' : cat.slug)}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checkBox(isSelected)}`}>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="truncate">{cat.name}</span>
                  </label>
                );
              })}
            </div>
          )}

          {categories.length > 5 && isCategoryOpen && (
            <button
              type="button"
              onClick={() => setShowAllCategories((current) => !current)}
              className="mx-auto mt-4 block text-sm font-semibold text-foreground underline underline-offset-4 hover:text-muted-foreground"
            >
              {showAllCategories ? 'Show less' : 'Show more'}
            </button>
          )}
        </section>

        {/* Price Range */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Price Range
          </h3>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5"
                min="0"
              />
            </div>
            <span className="text-muted-foreground/30 font-medium text-sm shrink-0">-</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sort By
          </h3>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 pl-9 pr-3 py-2.5 text-sm text-foreground transition-all focus:border-foreground/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-foreground/5 appearance-none cursor-pointer"
            >
              <option value="">Default</option>
              <option value={SortOption.PRICE_ASC}>Price: Low to High</option>
              <option value={SortOption.PRICE_DESC}>Price: High to Low</option>
              <option value={SortOption.NEWEST}>Newest</option>
              <option value={SortOption.TOP_RATED}>Top Rated</option>
            </select>
          </div>
        </div>

        {/* Clear All */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full rounded-xl border border-foreground/20 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-blue-600 hover:text-background"
          >
            Clear All Filters
          </button>
        )}
      </aside>
    </>
  );
}
