import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Target, 
  Users, 
  Shield, 
  Zap, 
  Heart, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Award,
  Clock,
  Smile,
  Shirt,
  Star,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Tag,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Quality Products",
    description: "Handpicked selection of premium fashion items that combine style and durability.",
    color: "text-blue-500"
  },
  {
    icon: Tag,
    title: "Best Prices",
    description: "Exclusive student discounts and deals that make fashion more affordable.",
    color: "text-green-500"
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Your transactions are protected with industry-standard security measures.",
    color: "text-purple-500"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your orders to you as fast as possible.",
    color: "text-orange-500"
  }
];

const stats = [
  { 
    number: 1000, 
    suffix: "+", 
    label: "Happy Students", 
    icon: Smile, 
    color: "text-blue-500" 
  },
  { 
    number: 50, 
    suffix: "+", 
    label: "Curated Brands", 
    icon: ShoppingBag, 
    color: "text-green-500" 
  },
  { 
    number: 24, 
    suffix: "", 
    label: "Hour Support", 
    icon: Headphones, 
    color: "text-purple-500" 
  },
  { 
    number: 100, 
    suffix: "%", 
    label: "Quality Checked", 
    icon: CheckCircle, 
    color: "text-pink-500" 
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function About() {
  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            About TARAA
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering students with affordable fashion choices that don't compromise on style
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="border-2 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-4 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-extrabold mb-1 ${stat.color}`}>
                    {stat.prefix}{stat.number}{stat.suffix}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">
              We're committed to providing the best shopping experience for students
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <Card className="border-2 p-8 md:p-12 max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to Find Your Perfect Style?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of students who trust TARAA for their fashion needs.
            </p>
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
              <Link to="/deals" className="group">
                Shop Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
