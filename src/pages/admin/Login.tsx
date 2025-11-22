import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
    const { login, verifyOtp } = useAdmin();
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        // SECURITY: Allow ONLY your specific number
        if (phone !== "9390730129") {
            toast.error("Access Denied: This number is not authorized.");
            return;
        }

        setLoading(true);
        const success = await login(phone);
        setLoading(false);
        if (success) setStep("otp");
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await verifyOtp(phone, otp);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">

            {/* Logo Section */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center mb-4">
                    <img
                        src="/logo.svg"
                        alt="TARAA Logo"
                        className="h-16 w-auto"
                    />
                </div>
                <p className="text-slate-500 font-medium mt-2">Admin Portal</p>
            </div>

            <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-200">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl font-semibold text-slate-800">
                        {step === "phone" ? "Secure Login" : "Verify Identity"}
                    </CardTitle>
                    <CardDescription>
                        {step === "phone"
                            ? "Enter your registered admin number"
                            : `Enter the code sent to +91 ${phone}`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {step === "phone" ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-600">Mobile Number</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="tel"
                                        placeholder="9390730129"
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={loading || phone.length < 10}
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Secure Code"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-600">Security Code</Label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="text"
                                        placeholder="• • • • • •"
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all tracking-[0.5em] text-center font-bold text-lg"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={loading || otp.length < 4}
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Access"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>

            <p className="mt-8 text-xs text-slate-400 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Secured by Supabase Auth
            </p>
        </div>
    );
}
