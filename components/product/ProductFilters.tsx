'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category, SortOption } from '@/types/index';
import { useEffect, useState } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);

    params.set('page', '1');

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products', {
      scroll: false,
    });
  }, [selectedCategory, minPrice, maxPrice, sort, router]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    router.push('/products', { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = selectedCategory || minPrice || maxPrice;

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <button
        className="hidden max-lg:flex w-full items-center justify-between gap-2 p-3.5 bg-white border border-blue-100 rounded-xl font-medium text-sm cursor-pointer mb-5 hover:border-blue-300 hover:shadow-sm transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle filters"
      >
        <span className="flex items-center gap-2 text-slate-700">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </span>
        <span className="flex items-center gap-2">
          {hasFilters && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {
                Object.values({
                  selectedCategory,
                  minPrice,
                  maxPrice,
                }).filter(Boolean).length
              }
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      <aside
        className={`flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 text-black shadow-sm sticky top-24 max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-0 max-lg:pt-16 max-lg:px-6 max-lg:pb-6 max-lg:translate-x-[-100%] max-lg:transition-transform max-lg:duration-300 ${
          isOpen ? 'max-lg:translate-x-0' : ''
        }`}
      >
        <button
          className="hidden max-lg:flex fixed top-4 right-4 z-10 items-center justify-center w-10 h-10 bg-white border border-blue-100 rounded-xl cursor-pointer text-slate-700 hover:bg-blue-50 transition-colors"
          onClick={() => setIsOpen(false)}
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-gray-100 pb-4 max-lg:block">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-black">
              Filters
            </h2>
            <p className="mt-1 text-sm text-gray-500">Refine your products</p>
          </div>
          {hasFilters && (
            <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white max-lg:hidden">
              {
                Object.values({
                  selectedCategory,
                  minPrice,
                  maxPrice,
                }).filter(Boolean).length
              }{' '}
              active
            </span>
          )}
        </div>

        <section className="rounded-xl bg-gray-50/80 p-3 ring-1 ring-gray-100">
          <button
            type="button"
            onClick={() => setIsCategoryOpen((current) => !current)}
            className="flex w-full items-center justify-between text-left text-base font-bold leading-none text-black"
            aria-expanded={isCategoryOpen}
          >
            <span>Category</span>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                isCategoryOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="mt-4 flex flex-col gap-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:text-black hover:ring-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!selectedCategory}
                  onChange={() => handleCategoryChange('')}
                  className="sr-only"
                />
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    !selectedCategory
                      ? 'border-white bg-white text-black'
                      : 'border-gray-300 bg-white text-white'
                  }`}
                >
                  {!selectedCategory && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="truncate">All Products</span>
              </label>

              {visibleCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;

                return (
                <label
                  key={cat.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:text-black hover:ring-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleCategoryChange(
                        selectedCategory === cat.slug ? '' : cat.slug
                      )
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      isSelected
                        ? 'border-white bg-white text-black'
                        : 'border-gray-300 bg-white text-white'
                    }`}
                  >
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
              className="mx-auto mt-4 block text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600"
            >
              {showAllCategories ? 'Show less' : 'Show more'}
            </button>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Price Range
          </h3>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                min="0"
              />
            </div>
            <span className="text-gray-300 font-medium text-sm flex-shrink-0">
              -
            </span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sort By
          </h3>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm text-gray-900 transition-all focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 appearance-none cursor-pointer"
            >
              <option value="">Default</option>
              <option value={SortOption.PRICE_ASC}>Price: Low to High</option>
              <option value={SortOption.PRICE_DESC}>Price: High to Low</option>
              <option value={SortOption.NEWEST}>Newest</option>
              <option value={SortOption.TOP_RATED}>Top Rated</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full rounded-xl border border-gray-900 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white"
          >
            Clear All Filters
          </button>
        )}
      </aside>
    </>
  );
}
