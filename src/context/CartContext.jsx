import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(undefined);
const STORAGE_KEY = 'mattu-cart';

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + (action.payload.qty || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }],
      };
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialState;
  } catch {
    return initialState;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (product, qty = 1) =>
    dispatch({ type: 'ADD', payload: { ...product, qty } });

  const removeItem = (id) =>
    dispatch({ type: 'REMOVE', payload: id });

  const updateQty = (id, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}