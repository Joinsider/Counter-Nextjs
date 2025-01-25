import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pb } from '@/lib/pocketbase';
import { CounterType } from '@/lib/pocketbase';

interface SideMenuState {
    types: CounterType[];
    isLoading: boolean;
    error: string | null;
    isCollapsed: boolean;
}

const initialState: SideMenuState = {
    types: [],
    isLoading: false,
    error: null,
    isCollapsed: true,
};

export const fetchCounterTypes = createAsyncThunk(
    'sideMenu/fetchCounterTypes',
    async () => {
        const records = await pb.collection('counter_type').getList<CounterType>(1, 50, {
            sort: 'title'
        });
        return records.items;
    }
);

const sideMenuSlice = createSlice({
    name: 'sideMenu',
    initialState,
    reducers: {
        toggleCollapse: (state) => {
            state.isCollapsed = !state.isCollapsed;
        },
        setCollapsed: (state, action) => {
            state.isCollapsed = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCounterTypes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCounterTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.types = action.payload;
            })
            .addCase(fetchCounterTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch counter types';
            });
    },
});

export const { toggleCollapse, setCollapsed } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;