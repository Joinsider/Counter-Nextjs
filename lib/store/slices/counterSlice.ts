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
}

const initialState: CounterState = {
    value: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    typeId: '',
    title: '',
    isLoading: false,
    error: null,
    id: '',
};

export const fetchCounter = createAsyncThunk(
    'counter/fetchCounter',
    async (typeId: string) => {
        try {
            const type = await pb.collection('counter_type').getOne(typeId);

            const today = new Date().toISOString().split('T')[0];
            const records = await pb.collection('counter').getList<Counter>(1, 1, {
                filter: `date = "${today}" && type = "${typeId}"`,
                expand: 'type'
            });

            if (records.items.length > 0) {
                const counter = records.items[0];
                return {
                    value: counter.value,
                    date: counter.date,
                    typeId,
                    title: type.title,
                    id: counter.id
                };
            }

            const newCounter = await pb.collection('counter').create<Counter>({
                value: 0,
                date: today,
                type: typeId,
            });

            return {
                value: newCounter.value,
                date: newCounter.date,
                typeId,
                title: type.title,
                id: newCounter.id
            };
        } catch (error) {
            console.error('Error fetching counter:', error);
            throw error;
        }

    }
);

export const incrementCounter = createAsyncThunk(
    'counter/increment',
    async (typeId: string, {getState}) => {
        try {
            const state = getState() as { counter: CounterState };
            const {id} = state.counter;

            const updatedCounter = await pb.collection('counter').update<Counter>(id, {
                value: state.counter.value + 1
            });

            return {
                value: updatedCounter.value
            };
        } catch (error) {
            console.error('Error incrementing counter:', error);
            throw error;
        }
    }
);

export const decrementCounter = createAsyncThunk(
    'counter/decrement',
    async (typeId: string, {getState}) => {
        try {
            const state = getState() as { counter: CounterState };
            const {id} = state.counter;

            const updatedCounter = await pb.collection('counter').update<Counter>(id, {
                value: state.counter.value - 1
            });

            return {
                value: updatedCounter.value
            };
        } catch (error) {
            console.error('Error decrementing counter:', error);
            throw error;
        }
    }
);

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
            });
    },
});

export default counterSlice.reducer;