// Import smooth scroll styles
import './styles/smooth-scroll.css';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import TawkToChat from "@/components/TawkToChat";
import Index from "./pages/Index";
import Deals from "./pages/Deals";
import Saved from "./pages/Saved";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Unisex from "./pages/Unisex";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import { AdminProvider } from "./contexts/AdminContext";
import { CartProvider } from "./contexts/CartContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { CartIcon } from "./components/CartIcon";

const queryClient = new QueryClient();

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScrollProvider>
            <ScrollToTop />
            <TawkToChat />
            <CartProvider>
              <AdminProvider>
                <div className="fixed top-4 right-4 z-40 hidden md:block md:top-6 md:right-6">
                  <CartIcon onClick={() => setIsCartOpen(true)} />
                </div>
                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/men" element={<Men />} />
                  <Route path="/women" element={<Women />} />
                  <Route path="/unisex" element={<Unisex />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/legal/disclaimer" element={<Disclaimer />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AdminProvider>
            </CartProvider>
          </SmoothScrollProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
