import Link from 'next/link';
import Container from '@/components/layout/Container';
import { ArrowRight, Shield, Clock, RefreshCw, ShoppingBag, Sparkles, Zap, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] animate-float opacity-50" />
        <div className="absolute top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[120px] animate-float-delayed opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 max-md:pt-24 max-md:pb-16 lg:min-h-[90vh] flex items-center">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>The Future of Shopping is Here</span>
              </div>
              <h1 className="text-6xl lg:text-7xl max-md:text-4xl font-extrabold text-foreground tracking-tight leading-[1.05] mb-6">
                Curated Products.<br />
                <span className="text-primary">Elevated Living.</span>
              </h1>
              <p className="text-xl max-md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg font-light">
                Discover a meticulously selected collection of premium essentials designed to enhance your everyday life.
              </p>
              <div className="flex items-center gap-4 max-sm:flex-col max-sm:items-stretch">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-foreground font-medium rounded-full border-2 border-border hover:border-primary/50 hover:bg-muted transition-all"
                >
                  View Offers
                </Link>
              </div>
            </div>

            {/* Hero Image / Visual */}
            <div className="relative z-10 lg:h-[600px] w-full max-lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
              <Image 
                src="/images/hero2.png" 
                alt="Premium Products Showcase" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 max-md:py-16 relative z-10">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Why Shop With Us</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Experience shopping the way it was meant to be—effortless, secure, and lightning fast.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Lightning Delivery', desc: 'Free express shipping on all orders. Arrives in 1-2 days.' },
              { icon: Shield, title: 'Bank-grade Security', desc: 'Your data is protected by state-of-the-art encryption.' },
              { icon: RefreshCw, title: 'Hassle-free Returns', desc: 'Not completely satisfied? Return it within 30 days.' },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div 
                key={title} 
                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories Visual Section */}
      <section className="py-24 max-md:py-16 bg-muted/30 relative z-10">
        <Container>
          <div className="flex items-end justify-between mb-12 max-md:flex-col max-md:items-start max-md:gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Shop By Category</h2>
              <p className="text-muted-foreground text-lg">Curated collections for every aspect of your life.</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group"
            >
              Browse All Categories
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'electronics', label: 'Electronics', img: '/images/electronics.png' },
              { id: 'fashion', label: 'Fashion', img: '/images/fashion.png' },
              { id: 'home', label: 'Home & Living', img: '/images/home.png' },
              { id: 'sports', label: 'Sports', img: '/images/sports.png' },
            ].map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative h-[400px] rounded-3xl overflow-hidden block border border-border shadow-md"
              >
                <Image 
                  src={cat.img} 
                  alt={cat.label} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-2xl translate-y-2 group-hover:translate-y-0 transition-transform">{cat.label}</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32 max-md:py-20 relative z-10 overflow-hidden">
        <Container>
          <div className="relative rounded-[3rem] overflow-hidden bg-foreground text-background py-20 px-8 text-center shadow-2xl">
            {/* CTA Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-40 animate-float" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-40 animate-float-delayed" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 mb-8 text-primary opacity-90" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to elevate your everyday?
              </h2>
              <p className="text-lg text-background/70 mb-10">
                Join thousands of satisfied customers who have upgraded their lifestyle with our premium collections.
              </p>
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 bg-background text-foreground font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-background/20"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-3">
                  Start Exploring Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
