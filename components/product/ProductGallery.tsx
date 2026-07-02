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
    <div className="sticky top-24 max-md:static">
      <div className="relative w-full aspect-square bg-linear-to-br from-muted/80 to-muted/60 border border-border/60 rounded-2xl overflow-hidden shadow-sm max-md:aspect-4/3 max-sm:aspect-square">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
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
