
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
      {/* Top Banner - Green (Hidden on Mobile) */}
      <div className="bg-primary text-primary-foreground hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+91 9390730129</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Get 50% Off on Selected Items</span>
              <Link to="/deals" className="underline hover:no-underline">
                Shop Now
              </Link>
            </div>
            <div className="hidden lg:block text-xs">
              Follow Us
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
                  <Mail className="h-4 w-4" />
                  <a href="mailto:sandeepnaikb0@gmail.com" className="hover:text-primary transition-colors">
                    sandeepnaikb0@gmail.com
                  </a>
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
