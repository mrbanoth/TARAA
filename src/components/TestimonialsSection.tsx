import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface TestimonialItem {
    id?: string;
    name: string;
    role: string;
    college: string;
    image: string;
    image_url?: string; // Handle both naming conventions
    rating: number;
    content: string;
}

const fallbackTestimonials: TestimonialItem[] = [
    {
        name: "Priya Sharma",
        role: "Final Year Student",
        college: "JNTUH, Hyderabad",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        rating: 5,
        content:
            "TARAA helped me find amazing oversized T‑shirts under ₹300! The deals are legit and shopping is super easy. Saved so much money this semester! 💯",
    },
    {
        name: "Rahul Verma",
        role: "2nd Year Student",
        college: "Osmania University",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        rating: 5,
        content:
            "Best place for student deals! I got a laptop bag and some tech gadgets at half the price. The whole hostel uses TARAA now. Highly recommended! 🔥",
    },
    {
        name: "Sneha Reddy",
        role: "3rd Year Student",
        college: "CBIT, Hyderabad",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        rating: 5,
        content:
            "Finally a website that understands student budgets! Clean interface, genuine products, and amazing collection. My go‑to for all shopping needs! ⭐",
    },
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>(fallbackTestimonials);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data && data.length > 0) {
                // Map Supabase data to component format
                const mappedData = data.map(item => ({
                    ...item,
                    image: item.image_url // Map image_url to image
                }));
                setTestimonials(mappedData);
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            // Keep fallback data on error
        }
    };

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

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="border-2 hover:border-primary/30 transition-all">
                            <CardHeader className="flex flex-col items-center text-center p-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-primary to-purple-500 p-0.5">
                                    <img
                                        src={t.image || t.image_url}
                                        alt={t.name}
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`;
                                        }}
                                    />
                                </div>
                                <CardTitle className="text-lg font-semibold">{t.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {t.role} • {t.college}
                                </p>
                                <Badge variant="secondary" className="mt-2">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star
                                            key={idx}
                                            className={`h-4 w-4 ${idx < t.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                                        />
                                    ))}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <p className="text-foreground leading-relaxed">"{t.content}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
