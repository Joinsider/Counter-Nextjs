import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define supported language codes
export const SUPPORTED_LANGUAGES = ['en', 'de', 'by'];

interface LanguageState {
    currentLanguage: string;
    manuallySet: boolean;
    supportedLanguages: string[];
}

const getInitialLanguage = () => {
    if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem('locale');
        // Improved validation with explicit fallback to 'de'
        if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
            return storedLanguage;
        }
    }
    return 'de';
};

const initialState: LanguageState = {
    currentLanguage: getInitialLanguage(),
    manuallySet: typeof window !== 'undefined' ? localStorage.getItem('localSetByUser') === 'true' : false,
    supportedLanguages: SUPPORTED_LANGUAGES
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            if (SUPPORTED_LANGUAGES.includes(action.payload)) {
                state.currentLanguage = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('locale', action.payload);
                }
            }
        },
        setManualLanguage: (state, action: PayloadAction<string>) => {
            if (SUPPORTED_LANGUAGES.includes(action.payload)) {
                state.currentLanguage = action.payload;
                state.manuallySet = true;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('locale', action.payload);
                    localStorage.setItem('localSetByUser', 'true');
                }
            }
        }
    }
});

export const {setLanguage, setManualLanguage} = languageSlice.actions;
export default languageSlice.reducer;