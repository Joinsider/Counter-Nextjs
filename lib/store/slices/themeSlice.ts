import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    theme: string;
}


const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'system';
    }
    return 'dark';
};

const initialState: ThemeState = {
    theme: getInitialTheme()
};

const themeSlice = createSlice({
    name: 'theme', // Changed from 'language'
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', action.payload);
            }
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;