// lib/store/slices/quoteSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { pb } from '@/lib/pocketbase';

// Define the quote interface
export interface Quote {
    id: string;
    lecturer: string;
    text: string;
    first_mentioned: string;
    created: string;
    updated: string;
}

interface QuoteState {
    quotes: Quote[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: QuoteState = {
    quotes: [],
    status: 'idle',
    error: null
};

// Async thunks
export const fetchQuotesByLecturer = createAsyncThunk(
    'quotes/fetchByLecturer',
    async (lecturerId: string) => {
        const records = await pb.collection('quotes').getList(1, 100, {
            filter: `lecturer = "${lecturerId}"`,
            sort: '-first_mentioned',
        });
        return records.items as unknown as Quote[];
    }
);

export const addQuote = createAsyncThunk(
    'quotes/addQuote',
    async ({ lecturerId, text, firstMentioned }: { lecturerId: string; text: string; firstMentioned: string }) => {
        const record = await pb.collection('quotes').create({
            lecturer: lecturerId,
            text: text.trim(),
            first_mentioned: firstMentioned,
        });
        return record as unknown as Quote;
    }
);

const quoteSlice = createSlice({
    name: 'quotes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotesByLecturer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchQuotesByLecturer.fulfilled, (state, action: PayloadAction<Quote[]>) => {
                state.status = 'succeeded';
                state.quotes = action.payload;
                state.error = null;
            })
            .addCase(fetchQuotesByLecturer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch quotes';
            })
            .addCase(addQuote.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addQuote.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.quotes = [action.payload, ...state.quotes];
            })
            .addCase(addQuote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to add quote';
            });
    },
});

export default quoteSlice.reducer;