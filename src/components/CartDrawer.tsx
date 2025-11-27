import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cart } from './Cart';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sliding panel */}
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col bg-background shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-foreground">
                    Shopping cart
                    {totalItems > 0 && ` (${totalItems})`}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="-mr-2 h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close panel</span>
                  </Button>
                </div>

                <div className="mt-8">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
