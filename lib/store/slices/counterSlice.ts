import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {pb} from '@/lib/pocketbase';
import {format} from 'date-fns';
import {Counter} from '@/lib/types/counter';

interface CounterState {
    value: number;
    date: string;
    typeId: string;
    title: string;
    isLoading: boolean;
    error: string | null;
    id: string;
    history: { date: string; value: number }[];
}

const initialState: CounterState = {
    value: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    typeId: '',
    title: '',
    isLoading: false,
    error: null,
    id: '',
    history: []
};

export const fetchCounter = createAsyncThunk(
    'counter/fetchCounter',
    async (typeID: string, {getState}) => {
        try {
            // Update the counter via the /api/counter/[id]/increment endpoint
            const state = getState() as { counter: CounterState };
            const uid = pb.authStore.model?.id;


            const response = await fetch(`/api/counter/${typeID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${pb.authStore.token}`,
                },
                body: JSON.stringify({
                    typeId: typeID,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch counter state');
            }
            const data = await response.json();
            return {
                value: data.value,
                date: format(new Date(), 'yyyy-MM-dd'),
                typeId: typeID,
                title: data.title,
                id: data.id
            };
        } catch (error) {
            console.error('Error incrementing counter on server:', error);
            throw error;
        }
    }
)

export const incrementCounter = createAsyncThunk(
    'counter/increment',
    async (typeID: string, {getState}) => {
        try {
            const uid = pb.authStore.model?.id;

            const response = await fetch(`/api/counter/${typeID}/increment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${pb.authStore.token}`,
                },
                body: JSON.stringify({
                    typeId: typeID,
                    userId: uid
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to increment counter');
            }
            const data = await response.json();
            return {
                value: data.value
            };
        } catch (error) {
            console.error('Error incrementing counter on server:', error);
            throw error;
        }
    }
)

export const decrementCounter = createAsyncThunk(
    'counter/decrement',
    async (typeID: string, {getState}) => {
        try {
            const uid = pb.authStore.model?.id;

            const response = await fetch(`/api/counter/${typeID}/decrement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${pb.authStore.token}`,
                },
                body: JSON.stringify({
                    typeId: typeID,
                    userId: uid
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to decrement counter');
            }
            const data = await response.json();
            return {
                value: data.value
            };
        } catch (error) {
            console.error('Error incrementing counter on server:', error);
            throw error;
        }
    }
)

export const fetchOldCounterValues = createAsyncThunk(
    'counter/fetchOldCounterValues',
    async ({typeID, month, year}: { typeID: string, month: number, year: number }, {getState}) => {
        try {
            const uid = pb.authStore.model?.id;

            // Create start date (first day of selected month)
            const startDate = new Date(year, month, 1);

            // Create end date (last day of selected month)
            const endDate = new Date(year, month + 1, 0);

            const response = await fetch(`/api/counter/${typeID}/old`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${pb.authStore.token}`,
                },
                body: JSON.stringify({
                    userId: uid,
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                }),
            });

            const responseData = await response.json();
            if (responseData.error) {
                throw new Error(responseData.error);
            } else if (!response.ok) {
                throw new Error('Failed to fetch counter history');
            }
            return responseData;
        } catch (e) {
            console.error('Error fetching old counter values:', e);
            throw e;
        }
    }
)

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCounter.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.value = action.payload.value;
                state.date = action.payload.date;
                state.typeId = action.payload.typeId;
                state.title = action.payload.title;
                state.id = action.payload.id;
            })
            .addCase(fetchCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch counter';
            })
            .addCase(incrementCounter.fulfilled, (state, action) => {
                state.value = action.payload.value;
            })
            .addCase(decrementCounter.fulfilled, (state, action) => {
                state.value = action.payload.value;
            })
            .addCase(fetchOldCounterValues.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOldCounterValues.fulfilled, (state, action) => {
                state.isLoading = false;
                state.history = Object.entries(action.payload).map(([date, value]) => ({
                    date,
                    value: value as number
                }));
            })
            .addCase(fetchOldCounterValues.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch counter history';
            })
    }
});


export default counterSlice.reducer;