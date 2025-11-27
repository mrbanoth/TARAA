import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

export function Cart() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalPrice,
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Cart ({totalItems})</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearCart}
          className="text-destructive hover:text-destructive/90"
        >
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={`${item.id}-${item.size || 'one-size'}`}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">
                  <Link to={`/product/${item.id}`} className="hover:underline">
                    {item.name}
                  </Link>
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFromCart(item.id, item.size)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>

              {item.size && (
                <p className="text-sm text-muted-foreground mt-1">
                  Size: {item.size}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>

                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="mt-6 space-y-4">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
