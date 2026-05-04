import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const initialLoadState = sessionStorage.getItem('cart')
  ? { cart: JSON.parse(sessionStorage.getItem('cart')!) }
  : undefined;

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: initialLoadState,
});

store.subscribe(() => {
  sessionStorage.setItem('cart', JSON.stringify(store.getState().cart));
});

export default store;
