import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Target, Users, Shield, Zap, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const features = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Empower students with easy access to stylish, affordable fashion while maintaining complete transparency."
    },
    {
      icon: Users,
      title: "Student Focused",
      description: "Every product is handpicked with college life in mind. We understand student budgets and needs."
    },
    {
      icon: Shield,
      title: "Safe Shopping",
      description: "We only partner with trusted, verified platforms. Your security and satisfaction matter to us."
    },
    {
      icon: Zap,
      title: "Transparent",
      description: "Upfront about our affiliate model. Honesty and transparency are our core values."
    }
  ];

  const stats = [
    { number: "20+", label: "Curated Products", icon: ShoppingBag },
    { number: "100%", label: "Budget Friendly", icon: Heart },
    { number: "₹399", label: "Max Price Point", icon: TrendingUp },
    { number: "24/7", label: "Always Available", icon: Sparkles }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Deals",
      description: "Explore our handpicked collection of trendy, affordable products curated for students."
    },
    {
      step: "2",
      title: "Find Your Style",
      description: "Use filters to find exactly what you need - by price, category, and size."
    },
    {
      step: "3",
      title: "Shop Securely",
      description: "Click 'Buy' to be redirected to our trusted partner apps (Meesho, Extrape) for checkout."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
            About TARAA
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 max-w-4xl mx-auto">
            Your Trusted Deals Platform for
            <span className="block text-primary mt-2">Students & Budget Shoppers</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We curate the best affordable fashion and essentials for college life. No gimmicks, just genuine deals.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What is TARAA - Two Column */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              What is TARAA?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A student-focused, budget-friendly affiliate deals platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* What We Do */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">What We Do</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We handpick trendy, affordable fashion items—primarily oversized T-shirts—and showcase them to help students and budget shoppers shop smart. We partner with trusted platforms like Meesho and Extrape to bring you the best deals.
                </p>
              </CardContent>
            </Card>

            {/* What We Don't Do */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">What We Don't Do</h3>
                <p className="text-muted-foreground leading-relaxed">
                  TARAA is purely a deals discovery platform. We don't handle payments, shipping, inventory, returns, or refunds. All transactions and customer service are managed by our partner platforms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and designed for students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {howItWorks.map((item, idx) => (
              <Card key={idx} className="border-2 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
                <CardContent className="p-6 md:p-8 relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose TARAA */}
      <div className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Why Students Love TARAA
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by students, for students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all shadow-md">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Model Transparency */}
      <div className="py-16 md:py-20 bg-white border-y">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-3xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Revenue Model</h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                TARAA operates on an <span className="font-semibold text-foreground">affiliate and advertisement-based revenue model</span>. When you make a purchase through our links, we earn a small commission at <span className="font-semibold text-foreground">no extra cost to you</span>. This helps us keep the platform free and continue curating amazing deals!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
