'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="sticky top-24">
      <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 animate-pulse" />
        )}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}