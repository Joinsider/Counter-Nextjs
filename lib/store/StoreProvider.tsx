'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import sideMenuReducer from './slices/sideMenuSlice';
import countdownReducer from './slices/countdownSlice';
import { ReactNode } from 'react';

export function StoreProvider({ children }: { children: ReactNode }) {
    const store = configureStore({
        reducer: {
            counter: counterReducer,
            sideMenu: sideMenuReducer,
            countdown: countdownReducer,
        },
    });

    return <Provider store={store}>{children}</Provider>;
}