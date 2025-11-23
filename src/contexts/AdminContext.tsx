import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AdminContextType {
    isAuthenticated: boolean;
    loading: boolean;
    login: (phone: string) => Promise<boolean>;
    verifyOtp: (phone: string, token: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session on mount
        // Supabase automatically stores session in localStorage
        // Admin stays logged in until they manually logout or clear browser data
        // NO AUTO-LOGOUT: Session persists across page refreshes and browser restarts
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (phone: string) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: "+91" + phone, // Assuming India, can be dynamic
            });

            if (error) throw error;
            toast.success("OTP sent to your mobile!");
            return true;
        } catch (error: unknown) {
            // Silent error handling for security
            toast.error(error instanceof Error ? error.message : 'Login failed');
            return false;
        }
    };

    const verifyOtp = async (phone: string, token: string) => {
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: "+91" + phone,
                token,
                type: "sms",
            });

            if (error) {
                throw error;
            }

            if (data.session || data.user) {
                if (data.session) setSession(data.session);
                toast.success("Welcome back, Admin!");
                navigate("/admin/dashboard");
                return true;
            }

            toast.error("Verification failed: No session created.");
            return false;
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to verify OTP");
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        navigate("/admin");
        toast.info("Logged out successfully");
    };

    return (
        <AdminContext.Provider value={{
            isAuthenticated: !!session,
            loading,
            login,
            verifyOtp,
            logout
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
