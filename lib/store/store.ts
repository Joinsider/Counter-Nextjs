import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import sideMenuReducer from './slices/sideMenuSlice';
import countdownReducer from './slices/countdownSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        sideMenu: sideMenuReducer,
        countdown: countdownReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;