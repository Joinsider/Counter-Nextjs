import { pb } from "@/lib/pocketbase";
import { ActionCreatorWithPreparedPayload, createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { RecordModel } from "pocketbase";


interface CountdownState {
    value: number;
    date: string;
    isLoading: boolean;
    error: string | null;
    id: string;
    admin: string;
}

const initialState: CountdownState = {
    value: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    isLoading: false,
    error: null,
    id: '',
    admin: '',
};

export const fetchCountdown = createAsyncThunk<{ value: number; date: string; id: string; admin: string }, string>(
    'countdown/fetchCountdown',
    async (id: string) => {
        try {
            const countdown = await pb.collection('countdown').getOne(id);
            
            return {
                value: countdown.value,
                date: countdown.date,
                id: countdown.id,
                admin: countdown.admin
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const fetchAllCountdowns = createAsyncThunk(
    'countdown/fetchAllCountdowns',
    async () => {
        try {
            const countdowns = await pb.collection('countdown').getList();
            return countdowns.items;
export const fetchAllCountdowns = createAsyncThunk<RecordModel[], void>(
    'countdown/fetchAllCountdowns',
    async () => {
        try {
            const countdowns = await pb.collection('countdown').getList();
            return countdowns.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);
export const updateCountdown = createAsyncThunk<{ value: number; date: string; id: string; admin: string }, CountdownState>(
    'countdown/updateCountdown',
    async (countdown: CountdownState) => {
        try {
            const updatedCountdown = await pb.collection('countdown').update(countdown.id, countdown);
            return updatedCountdown;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);
            return countdowns;
export const createCountdown = createAsyncThunk<{ value: number; date: string; id: string; admin: string }, CountdownState>(
    'countdown/createCountdown',
    async (countdown: CountdownState) => {
        try {
            const newCountdown = await pb.collection('countdown').create(countdown);
            return newCountdown;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);
            return id;
export const deleteCountdown = createAsyncThunk<string, string>(
    'countdown/deleteCountdown',
    async (id: string) => {
        try {
            await pb.collection('countdown').delete(id);
            return id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);
    },
    extraReducers: (builder: { addCase: (arg0: ActionCreatorWithPreparedPayload<[string, string, unknown?], undefined, string, never, { arg: string; requestId: string; requestStatus: "pending"; }>, arg1: (state: any) => void) => { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[{ value: any; date: any; id: string; admin: any; }, string, string, unknown?], { value: any; date: any; id: string; admin: any; }, string, never, { arg: string; requestId: string; requestStatus: "fulfilled"; }>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[Error | null, string, string, unknown?, unknown?], unknown, string, SerializedError, { arg: string; requestId: string; requestStatus: "rejected"; aborted: boolean; condition: boolean; } & ({ rejectedWithValue: true; } | ({ rejectedWithValue: false; } & {}))>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[string, void, unknown?], undefined, string, never, { arg: void; requestId: string; requestStatus: "pending"; }>, arg1: (state: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[RecordModel[], string, void, unknown?], RecordModel[], string, never, { arg: void; requestId: string; requestStatus: "fulfilled"; }>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[Error | null, string, void, unknown?, unknown?], unknown, string, SerializedError, { arg: void; requestId: string; requestStatus: "rejected"; aborted: boolean; condition: boolean; } & ({ rejectedWithValue: true; } | ({ rejectedWithValue: false; } & {}))>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[string, CountdownState, unknown?], undefined, string, never, { arg: CountdownState; requestId: string; requestStatus: "pending"; }>, arg1: (state: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[RecordModel, string, CountdownState, unknown?], RecordModel, string, never, { arg: CountdownState; requestId: string; requestStatus: "fulfilled"; }>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[Error | null, string, CountdownState, unknown?, unknown?], unknown, string, SerializedError, { arg: CountdownState; requestId: string; requestStatus: "rejected"; aborted: boolean; condition: boolean; } & ({ rejectedWithValue: true; } | ({ rejectedWithValue: false; } & {}))>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[string, CountdownState, unknown?], undefined, string, never, { arg: CountdownState; requestId: string; requestStatus: "pending"; }>, arg1: (state: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[RecordModel, string, CountdownState, unknown?], RecordModel, string, never, { arg: CountdownState; requestId: string; requestStatus: "fulfilled"; }>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[Error | null, string, CountdownState, unknown?, unknown?], unknown, string, SerializedError, { arg: CountdownState; requestId: string; requestStatus: "rejected"; aborted: boolean; condition: boolean; } & ({ rejectedWithValue: true; } | ({ rejectedWithValue: false; } & {}))>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[string, string, unknown?], undefined, string, never, { arg: string; requestId: string; requestStatus: "pending"; }>, arg1: (state: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[string, string, string, unknown?], string, string, never, { arg: string; requestId: string; requestStatus: "fulfilled"; }>, arg1: (state: any, action: any) => void): { (): any; new(): any; addCase: { (arg0: ActionCreatorWithPreparedPayload<[Error | null, string, string, unknown?, unknown?], unknown, string, SerializedError, { arg: string; requestId: string; requestStatus: "rejected"; aborted: boolean; condition: boolean; } & ({ rejectedWithValue: true; } | ({ rejectedWithValue: false; } & {}))>, arg1: (state: any, action: any) => void): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; }) => builder
        .addCase(fetchCountdown.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchCountdown.fulfilled, (state, action) => {
            state.isLoading = false;
            state.value = action.payload.value;
            state.date = action.payload.date;
            state.id = action.payload.id;
            state.admin = action.payload.admin;
        })
        .addCase(fetchCountdown.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'Error fetching countdown';
        })
        .addCase(fetchAllCountdowns.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchAllCountdowns.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.value = 0;
            state.date = format(new Date(), 'yyyy-MM-dd');
            state.id = '';
            state.admin = '';
        })
        .addCase(fetchAllCountdowns.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'Error fetching countdowns';
        })
        .addCase(updateCountdown.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateCountdown.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.value = action.payload.value;
            state.date = action.payload.date;
            state.id = action.payload.id;
            state.admin = action.payload.admin;
        })
        .addCase(updateCountdown.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'Error updating countdown';
        })
        .addCase(createCountdown.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createCountdown.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.value = action.payload.value;
            state.date = action.payload.date;
            state.id = action.payload.id;
            state.admin = action.payload.admin;
        })
        .addCase(createCountdown.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'Error creating countdown';
        })
        .addCase(deleteCountdown.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(deleteCountdown.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.value = 0;
            state.date = format(new Date(), 'yyyy-MM-dd');
            state.id = '';
            state.admin = '';
        })
        .addCase(deleteCountdown.rejected, (state, action) => {
            state.isLoading = false;
            state.error = 'Error deleting countdown';
        })
    });
});

export default countdownSlice.reducer;