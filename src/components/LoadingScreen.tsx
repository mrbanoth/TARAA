import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Logo with pulse animation */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-20 animate-pulse" />
                    <img
                        src="/logo.svg"
                        alt="TARAA"
                        className="h-20 w-auto relative z-10 animate-bounce"
                        style={{ animationDuration: '2s' }}
                    />
                </div>

                {/* Loading text */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-lg font-semibold text-slate-700">
                        Loading amazing deals{dots}
                    </p>
                    <p className="text-sm text-muted-foreground">Curated just for you</p>
                </div>

                {/* Progress bar */}
                <div className="mt-8 w-64 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-green-400 animate-loading-bar" />
                </div>
            </div>
        </div>
    );
}
