import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    name: string;
    role: string;
    college: string;
    image: string;
    rating: number;
    content: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Priya Sharma",
        role: "Final Year Student",
        college: "JNTUH, Hyderabad",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        rating: 5,
        content: "TARAA helped me find amazing oversized T-shirts under ₹300! The deals are legit and shopping is super easy. Saved so much money this semester! 💯",
    },
    {
        name: "Rahul Verma",
        role: "2nd Year Student",
        college: "Osmania University",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        rating: 5,
        content: "Best place for student deals! I got a laptop bag and some tech gadgets at half the price. The whole hostel uses TARAA now. Highly recommended! 🔥",
    },
    {
        name: "Sneha Reddy",
        role: "3rd Year Student",
        college: "CBIT, Hyderabad",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        rating: 5,
        content: "Finally a website that understands student budgets! Clean interface, genuine products, and amazing collection. My go-to for all shopping needs! ⭐",
    },
    {
        name: "Arjun Kumar",
        role: "1st Year Student",
        college: "VNR VJIET",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        rating: 5,
        content: "Stumbled upon TARAA while looking for budget-friendly hostel essentials. Got everything I needed at crazy discounts. Life saver for freshers! 🙌",
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">Student Reviews</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        What Students Say About TARAA
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of happy students saving money on trendy fashion and essentials!
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group relative overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <CardContent className="p-6 md:p-8 relative z-10">
                                {/* Quote Icon */}
                                <Quote className="h-10 w-10 text-primary/20 mb-4" />

                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-foreground leading-relaxed mb-6 text-base">
                                    "{testimonial.content}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-500 p-0.5">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full rounded-full bg-white"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role} • {testimonial.college}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"
                                />
                            ))}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-foreground">5,000+ Students</p>
                            <p className="text-sm text-muted-foreground">Trust TARAA for deals</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
