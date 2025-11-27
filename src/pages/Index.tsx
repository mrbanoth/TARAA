import { Link } from "react-router-dom";
import { Flame, ShoppingBag, BookOpen, Laptop, Home as HomeIcon, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import BentoGrid from "@/components/BentoGrid";
import HotDeals from "@/components/HotDeals";
import SEO from "@/components/SEO";

export default function Index() {
  const { products, loading } = useProducts();

  const featuredProducts = products
    .filter((p) => p.category === "tshirt" || p.name.toLowerCase().includes("t-shirt"))
    .slice(0, 4);
  const trendingProducts = products
    .filter((p) => p.clicks && p.clicks > 1000)
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 6);

  const categories = [
    {
      name: "Oversized T-Shirts",
      icon: ShoppingBag,
      link: "/deals?category=tshirt",
      color: "bg-[hsl(var(--category-furniture))]",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
    },
    {
      name: "College Bags",
      icon: BookOpen,
      link: "/deals?category=bag",
      color: "bg-[hsl(var(--category-handbag))]",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80"
    },
    {
      name: "Budget Tech",
      icon: Laptop,
      link: "/deals?category=tech",
      color: "bg-[hsl(var(--category-tech))]",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
    },
    {
      name: "Hostel Essentials",
      icon: HomeIcon,
      link: "/deals?category=hostel",
      color: "bg-[hsl(var(--category-travel))]",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80"
    },
  ];

  const trustPoints = [
    { icon: Users, title: "Curated Picks Only", desc: "Handpicked for college students" },
    { icon: Shield, title: "Checkout on Trusted Apps", desc: "Safe purchases via verified platforms" },
    { icon: Zap, title: "Free to Use", desc: "Always free for students" },
  ];

  const scrollToProducts = () => {
    document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <SEO
        title="Student Deals & Discounts | Save Money on Fashion, Tech & More"
        description="TARAA is the #1 platform for Indian students to find exclusive deals, discounts, and offers on fashion, electronics, books, and more. Save big today!"
      />
      {/* Hero Section with Bento Grid */}
      <section className="bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Text Content */}
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
              Student Deals
              <span className="block text-primary mt-1">Budget Store.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Trendy fashion for students at budget-friendly prices. We've got you covered!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-5 rounded-full text-base"
              >
                Browse Deals
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="font-semibold px-6 py-5 rounded-full text-base border-2"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Bento Grid - Desktop (md and up) */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* Large card */}
            <div className="row-span-2 col-span-2 rounded-2xl overflow-hidden h-80">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
                alt="Fashion"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Medium card */}
            <div className="rounded-2xl overflow-hidden h-48">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
                alt="Bags"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Small card */}
            <div className="bg-primary/10 rounded-2xl p-4 flex flex-col justify-center items-center">
              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
              <span className="font-medium text-center">Trending Now</span>
            </div>
            
            {/* Medium card */}
            <div className="rounded-2xl overflow-hidden h-48">
              <img
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80"
                alt="Tech"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Small card */}
            <div className="bg-secondary/10 rounded-2xl p-4 flex flex-col justify-center items-center">
              <Flame className="h-8 w-8 text-orange-500 mb-2" />
              <span className="font-medium text-center">Hot Deals</span>
            </div>
          </div>
          
          {/* Mobile Grid (sm and down) */}
          <div className="md:hidden grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* Top row - Full width banner */}
            <div className="col-span-2 rounded-xl overflow-hidden h-40">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
                alt="Fashion"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Middle row - Two equal cards */}
            <div className="rounded-xl overflow-hidden h-32">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
                alt="Bags"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-32">
              <img
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80"
                alt="Tech"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Bottom row - Two feature cards */}
            <div className="bg-primary/10 rounded-xl p-3 flex flex-col justify-center items-center">
              <ShoppingBag className="h-6 w-6 text-primary mb-1" />
              <span className="text-sm font-medium text-center">Trending</span>
            </div>
            <div className="bg-secondary/10 rounded-xl p-3 flex flex-col justify-center items-center">
              <Flame className="h-6 w-6 text-orange-500 mb-1" />
              <span className="text-sm font-medium text-center">Hot Deals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <point.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending T-Shirts Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              Hot Picks
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Trending T-Shirts
            </h2>
            <p className="text-muted-foreground text-lg">
              Grab the coolest tees at unbeatable prices!
            </p>
          </div>
          <div className="relative group">
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-none w-[280px] sm:w-[320px] snap-center first:pl-0 last:pr-4"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Shop Our Top Categories
            </h2>
            <p className="text-muted-foreground text-lg">
              Curated collections for every student need
            </p>
          </div>

          <div className="relative">
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex-none w-[calc(100vw-3rem)] sm:w-80 snap-center first:pl-0 last:pr-4">
                  <Link to={cat.link} className="block h-full">
                    <Card className={`overflow-hidden group hover:shadow-xl transition-all duration-300 h-64 ${cat.color} cursor-pointer relative border-0`}>
                      <CardContent className="p-0 h-full relative">
                        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                          <h3 className="text-2xl font-bold text-white drop-shadow-lg leading-tight">
                            {cat.name}
                          </h3>
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <cat.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Image Overlay */}
                        <div className="absolute inset-0 mix-blend-overlay opacity-20 group-hover:opacity-30 transition-opacity">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Scroll indicator for mobile */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
              {categories.map((_, idx) => (
                <span 
                  key={idx}
                  className="w-2 h-2 rounded-full bg-gray-300"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bento Section: Hot Deals, Trending Now, Most Popular Picks */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Compute randomised groups */}
          {(() => {
            const shuffled = [...products].sort(() => Math.random() - 0.5);
            const hotDeals = shuffled.slice(0, 6);
            const trendingDeals = shuffled.slice(0, 4); // Show 4 random products
            const popularDeals = shuffled.slice(12, 18);
            const hasAny = hotDeals.length || trendingDeals.length || popularDeals.length;
            return (
              <>
                {hotDeals.length > 0 && (
                  <div className="text-center mb-12">
                    <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
                      Limited Time
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                      Hot Deals
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                      Don't miss out on these exclusive offers
                    </p>
                    <HotDeals products={hotDeals} />
                  </div>
                )}
                {trendingDeals.length > 0 && (
                  <div className="text-center pt-8 mb-12">
                    <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
                      Popular
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                      Trending Now
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                      What everyone is loving right now
                    </p>
                    <BentoGrid products={trendingDeals} />
                  </div>
                )}
                {popularDeals.length > 0 && (
                  <>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center my-8">
                      Most Popular Picks by Students This Week
                    </h2>
                    <BentoGrid products={popularDeals} />
                  </>
                )}
                {!hasAny && (
                  <p className="text-center text-muted-foreground mt-12">
                    No products found.
                  </p>
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <Newsletter /> */}


      {/* Collab CTA */}
      < section className="py-16 bg-primary text-white" >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              Partner With Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Want Your Brand on TARAA?
            </h2>
            <p className="text-white text-lg mb-8">
              Collaborate with us for student-focused and budget-friendly promotions. Reach thousands of college students.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full px-8 py-6 text-lg font-semibold"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
