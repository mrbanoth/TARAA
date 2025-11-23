
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, Search, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { useFavorites } from "@/hooks/useFavorites";

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/deals", label: "Deals" },
  { to: "/saved", label: "Saved" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Banner - Now shown on all devices */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            {/* Phone - hidden on smallest screens */}
            <div className="hidden sm:flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+91 9390730129</span>
            </div>

            {/* Promo - centered on mobile */}
            <div className="flex items-center gap-2 md:gap-4">
              <span className="font-medium text-center">Get 50% Off on Selected Items</span>
              <Link to="/deals" className="underline hover:no-underline whitespace-nowrap">
                Shop Now
              </Link>
            </div>

            {/* Social - icons only on mobile */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium hidden md:inline">Follow Us:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/taraa.deals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/TaraaDeals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Join us on Telegram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.48 1.02-.73 3.99-1.73 6.65-2.87 7.98-3.43 3.8-1.58 4.59-1.85 5.1-1.86.11 0 .37.03.53.17.14.11.17.26.19.37.01.08.03.29.01.45z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919390730129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Chat on WhatsApp"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.svg"
                alt="TARAA Logo"
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors relative group"
                  activeClassName="text-primary"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <Link to="/saved" className="hidden md:flex">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Badge variant="secondary" className="hidden lg:inline-flex bg-accent/10 text-accent hover:bg-accent/20">
                Handpicked Deals
              </Badge>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="group hover:bg-transparent">
                      <div className="flex flex-col gap-1.5 items-end justify-center w-8 h-8">
                        <span className="w-6 h-0.5 bg-foreground rounded-full transition-all group-hover:w-8"></span>
                        <span className="w-4 h-0.5 bg-foreground rounded-full transition-all group-hover:w-8"></span>
                        <span className="w-6 h-0.5 bg-foreground rounded-full transition-all group-hover:w-8"></span>
                      </div>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] bg-white">
                    <div className="flex flex-col gap-6 mt-8">
                      <div className="flex items-center">
                        <img
                          src="/logo.svg"
                          alt="TARAA Logo"
                          className="h-8 w-auto"
                        />
                      </div>

                      <Badge variant="secondary" className="w-fit bg-accent/10 text-accent">
                        Handpicked Deals
                      </Badge>

                      <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                            activeClassName="text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </NavLink>
                        ))}
                        <Link
                          to="/saved"
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 flex items-center justify-between"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Saved Items
                          {favorites.length > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white">
                              {favorites.length}
                            </Badge>
                          )}
                        </Link>
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <img
                  src="/logo.svg"
                  alt="TARAA Logo"
                  className="h-9 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Handpicked deals for students and budget shoppers. We curate the best affordable fashion and essentials for college life.
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 9390730129</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Contact us via the form above</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/legal/disclaimer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Important Info */}
              <div>
                <h3 className="font-semibold mb-4 text-foreground">Important</h3>
                <p className="text-sm text-muted-foreground">
                  We only show deals and redirect to trusted shopping apps. We do not handle orders, shipping or refunds.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 TARAA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
