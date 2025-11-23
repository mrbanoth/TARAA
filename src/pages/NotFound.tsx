import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Silent 404 handling for security
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="space-y-6 max-w-md mx-auto animate-in fade-in zoom-in duration-500">
        {/* Illustration Icon */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-primary/20 tracking-tighter">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Lost in the Aisles?
          </h2>
          <p className="text-muted-foreground text-lg">
            The page you're looking for seems to have gone out of stock or moved to a new shelf.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/deals">
              <Search className="mr-2 h-4 w-4" />
              Browse Deals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
