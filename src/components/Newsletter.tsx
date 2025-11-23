import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Simulate API call
        setTimeout(() => {
            setSubscribed(true);
            toast.success("Successfully subscribed to the newsletter!");
            setEmail("");
        }, 1000);
    };

    return (
        <section className="py-16 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-primary/10">
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                                    Don't Miss the <span className="text-primary">Hottest Drops</span>
                                </h2>
                                <p className="text-muted-foreground">
                                    Join 5,000+ students getting the best budget deals delivered straight to their inbox. No spam, just savings.
                                </p>
                            </div>

                            {subscribed ? (
                                <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg border border-green-100 animate-in fade-in slide-in-from-bottom-2">
                                    <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                    <span className="font-medium">Thanks for subscribing! Keep an eye on your inbox.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                        <Input
                                            type="email"
                                            placeholder="Enter your college email"
                                            className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" size="lg" className="h-12 px-8 font-semibold shadow-lg shadow-primary/20">
                                        Subscribe
                                    </Button>
                                </form>
                            )}

                            <p className="text-xs text-muted-foreground/80">
                                By subscribing, you agree to our Terms & Privacy Policy.
                            </p>
                        </div>

                        <div className="relative hidden md:block bg-primary">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />
                            <div className="absolute inset-0 flex items-center justify-center p-12 text-white/90">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl font-black opacity-20">50%</div>
                                    <div className="text-4xl font-bold">OFF</div>
                                    <p className="text-sm opacity-80 max-w-[200px] mx-auto">On selected brands for our newsletter subscribers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
