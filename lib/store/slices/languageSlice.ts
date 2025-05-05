import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguage: string;
  manuallySet: boolean;
}

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('locale') || 'de';
  }
  return 'de';
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
  manuallySet: typeof window !== 'undefined' ? localStorage.getItem('localSetByUser') === 'true' : false
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', action.payload);
      }
    },
    setManualLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
      state.manuallySet = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', action.payload);
        localStorage.setItem('localSetByUser', 'true');
      }
    }
  }
});

export const { setLanguage, setManualLanguage } = languageSlice.actions;
export default languageSlice.reducer;