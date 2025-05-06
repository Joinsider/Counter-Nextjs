// lib/store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import sideMenuReducer from './slices/sideMenuSlice';
import languageSlice from './slices/languageSlice';
import themeSlice from './slices/themeSlice';
import lecturerReducer from './slices/lecturerSlice';
import quoteReducer from './slices/quoteSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        language: languageSlice,
        sideMenu: sideMenuReducer,
        theme: themeSlice,
        lecturer: lecturerReducer,
        quotes: quoteReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;