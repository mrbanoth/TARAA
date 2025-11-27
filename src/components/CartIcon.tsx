import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { totalItems } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative ${className}`}
      onClick={onClick}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Button>
  );
}
