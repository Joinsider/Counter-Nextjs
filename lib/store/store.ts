import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import sideMenuReducer from './slices/sideMenuSlice';
import languageSlice from './slices/languageSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    language: languageSlice,
    sideMenu: sideMenuReducer,
    theme: themeSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;