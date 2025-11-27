import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

// Session refresh interval (55 minutes - refresh before token expires)
const SESSION_REFRESH_INTERVAL = 55 * 60 * 1000;

interface AdminContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
    login: (phone: string) => Promise<boolean>;
    verifyOtp: (phone: string, token: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    // Function to refresh session
    const refreshSession = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            
            if (data.session) {
                setSession(data.session);
                setUser(data.session.user);
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            // Don't log out on refresh error, let the session expire naturally
        }
    }, []);

    // Setup session refresh interval
    const setupRefreshInterval = useCallback(() => {
        // Clear any existing interval
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        // Set up new interval
        const interval = setInterval(() => {
            if (session) {
                refreshSession();
            }
        }, SESSION_REFRESH_INTERVAL);

        setRefreshInterval(interval);
        return () => clearInterval(interval);
    }, [session, refreshSession]);

    useEffect(() => {
        // Check active session on mount
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                
                if (currentSession) {
                    setSession(currentSession);
                    setUser(currentSession.user);
                    setupRefreshInterval();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user || null);
                
                if (newSession) {
                    setupRefreshInterval();
                } else {
                    if (refreshInterval) {
                        clearInterval(refreshInterval);
                        setRefreshInterval(null);
                    }
                }
                
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
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
        try {
            // Clear refresh interval first
            if (refreshInterval) {
                clearInterval(refreshInterval);
                setRefreshInterval(null);
            }

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Clear local state
            setSession(null);
            setUser(null);
            
            // Navigate to admin login
            navigate("/admin");
            toast.info("Logged out successfully");
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Failed to log out. Please try again.');
        }
    };

    return (
        <AdminContext.Provider value={{
            isAuthenticated: !!session,
            loading,
            user,
            login,
            verifyOtp,
            logout,
            refreshSession
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
