import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

const CART_STORAGE_KEY = 'taraa_cart_v1';
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to safely parse localStorage data
const safeParseJSON = <T,>(data: string | null, fallback: T): T => {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error parsing cart data:', error);
    }
    return fallback;
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = safeParseJSON<CartItem[]>(savedCart, []);
        setItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load cart:', error);
      }
      // Clear invalid cart data
      localStorage.removeItem(CART_STORAGE_KEY);
      setItems([]);
    }
    setIsMounted(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to save cart:', error);
        }
      }
    }
  }, [items, isMounted]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      try {
        const existingItemIndex = prevItems.findIndex(
          (i) => i.id === item.id && i.size === item.size
        );

        if (existingItemIndex >= 0) {
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
          };
          toast.success(`Updated quantity for ${item.name}`);
          return newItems;
        }

        toast.success(`${item.name} added to cart`);
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error adding to cart:', error);
        }
        return prevItems;
      }
    });
  }, []);

  const removeFromCart = useCallback((id: string, size?: string) => {
    setItems((prevItems) => {
      try {
        const itemToRemove = prevItems.find(
          (item) => item.id === id && item.size === size
        );

        if (itemToRemove) {
          toast.success(`${itemToRemove.name} removed from cart`);
        }

        return prevItems.filter((item) => !(item.id === id && item.size === size));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error removing from cart:', error);
        }
        return prevItems;
      }
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number, size?: string) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setItems((prevItems) => {
      try {
        return prevItems.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        );
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating quantity:', error);
        }
        return prevItems;
      }
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    try {
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error clearing cart:', error);
      }
    }
  }, []);

  const isInCart = useCallback((id: string, size?: string) => {
    return items.some((item) => item.id === id && item.size === size);
  }, [items]);

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
