import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

// Types
type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  addedAt?: number;
  updatedAt?: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'addedAt' | 'updatedAt'> & { quantity?: number }) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string, size?: string) => boolean;
  lastUpdated?: number;
};

// Constants
const CART_STORAGE_KEY = 'taraa_cart_v1';
const MAX_CART_ITEMS = 100;
const MAX_QUANTITY = 10;
const CART_EXPIRY_DAYS = 30;

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper functions
const getCurrentTime = () => Math.floor(Date.now() / 1000);

const validateCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.imageUrl === 'string' &&
    typeof item.quantity === 'number' &&
    (item.size === undefined || typeof item.size === 'string') &&
    item.quantity > 0 &&
    item.quantity <= MAX_QUANTITY
  );
};

const sanitizeCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  
  const now = getCurrentTime();
  return items
    .filter(item => validateCartItem(item))
    .map(item => ({
      ...item,
      quantity: Math.min(Math.max(1, Math.floor(item.quantity)), MAX_QUANTITY),
      price: Math.max(0, Number(item.price)),
      addedAt: item.addedAt || now,
      updatedAt: now
    }))
    .slice(0, MAX_CART_ITEMS);
};

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
  const [lastUpdated, setLastUpdated] = useState<number>();

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (!savedCart) return;

        const parsed = JSON.parse(savedCart);
        const cartData = Array.isArray(parsed?.items) ? parsed.items : [];
        const cartTimestamp = parsed?.timestamp || 0;
        
        // Check if cart is expired (older than 30 days)
        const now = getCurrentTime();
        if (now - cartTimestamp > CART_EXPIRY_DAYS * 24 * 60 * 60) {
          localStorage.removeItem(CART_STORAGE_KEY);
          return;
        }

        const sanitizedItems = sanitizeCartItems(cartData);
        setItems(sanitizedItems);
        setLastUpdated(cartTimestamp);
      } catch (error) {
        // Clear corrupted cart data
        localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setIsMounted(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isMounted) return;

    const saveCart = () => {
      try {
        const cartData = {
          items,
          timestamp: getCurrentTime(),
          version: 1
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        setLastUpdated(cartData.timestamp);
      } catch (error) {
        // Handle storage quota exceeded or other errors
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // If storage is full, clear the cart to free up space
          setItems([]);
        }
      }
    };

    const timer = setTimeout(saveCart, 300); // Debounce save operations
    return () => clearTimeout(timer);
  }, [items, isMounted]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'addedAt' | 'updatedAt'> & { quantity?: number }) => {
    setItems((prevItems) => {
      // Check if cart is full
      if (prevItems.length >= MAX_CART_ITEMS) {
        toast.error(`Maximum ${MAX_CART_ITEMS} items allowed in cart`);
        return prevItems;
      }

      try {
        const now = getCurrentTime();
        const quantity = Math.min(Math.max(1, item.quantity || 1), MAX_QUANTITY);
        const existingItemIndex = prevItems.findIndex(
          (i) => i.id === item.id && i.size === item.size
        );

        if (existingItemIndex >= 0) {
          const newItems = [...prevItems];
          const newQuantity = Math.min(
            newItems[existingItemIndex].quantity + quantity,
            MAX_QUANTITY
          );
          
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newQuantity,
            updatedAt: now
          };
          
          if (newQuantity >= MAX_QUANTITY) {
            toast.info(`Maximum quantity of ${MAX_QUANTITY} reached for ${item.name}`);
          } else {
            toast.success(`Updated quantity for ${item.name}`);
          }
          
          return newItems;
        }

        // Add new item
        const newItem: CartItem = {
          ...item,
          quantity,
          addedAt: now,
          updatedAt: now
        };

        toast.success(`${item.name} added to cart`);
        return [...prevItems, newItem];
      } catch (error) {
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

    const safeQuantity = Math.min(Math.floor(quantity), MAX_QUANTITY);
    
    if (safeQuantity >= MAX_QUANTITY) {
      toast.info(`Maximum quantity per item is ${MAX_QUANTITY}`);
    }

    setItems((prevItems) => {
      try {
        return prevItems.map((item) =>
          item.id === id && item.size === size 
            ? { 
                ...item, 
                quantity: safeQuantity,
                updatedAt: getCurrentTime()
              } 
            : item
        );
      } catch (error) {
        return prevItems;
      }
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('Cart cleared');
  }, []);

  const isInCart = useCallback((id: string, size?: string) => {
    return items.some((item) => item.id === id && item.size === size);
  }, [items]);

  // Memoize calculations
  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [items]);

  // Clean up expired cart data on unmount
  useEffect(() => {
    return () => {
      const now = getCurrentTime();
      if (lastUpdated && now - lastUpdated > CART_EXPIRY_DAYS * 24 * 60 * 60) {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    };
  }, [lastUpdated]);

  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    lastUpdated
  }), [items, totalItems, totalPrice, isInCart, lastUpdated]);

  return (
    <CartContext.Provider value={contextValue}>
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
