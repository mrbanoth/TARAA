import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string, size?: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data', error);
      }
    }
    setIsMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
        };
        toast.success(`Updated quantity for ${item.name}`);
        return newItems;
      }

      // Add new item to cart
      toast.success(`${item.name} added to cart`);
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string, size?: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.id === id && item.size === size
      );
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`);
      }
      
      return prevItems.filter((item) => !(item.id === id && item.size === size));
    });
  };

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const isInCart = (id: string, size?: string) => {
    return items.some((item) => item.id === id && item.size === size);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
