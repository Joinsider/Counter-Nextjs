import { pb } from "@/lib/pocketbase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RecordModel } from "pocketbase";

interface Countdown {
    id: string;
    title: string;
    date: string;
    created: string;
    admin: string;
}

interface CountdownState {
    activeCountdowns: Countdown[];
    pastCountdowns: Countdown[];
    currentCountdown: Countdown | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CountdownState = {
    activeCountdowns: [],
    pastCountdowns: [],
    currentCountdown: null,
    isLoading: false,
    error: null,
};

export const fetchCountdowns = createAsyncThunk(
    'countdown/fetchCountdowns',
    async () => {
        try {
            if (!pb.authStore.isValid) {
                throw new Error('Authentication required');
            }

            const records = await pb.collection('countdown').getList(1, 50, {
                sort: 'date',
                expand: 'admin'
            });

            const now = new Date();
            const active: Countdown[] = [];
            const past: Countdown[] = [];

            records.items.forEach((item: any) => {
                const countdown = {
                    id: item.id,
                    title: item.title,
                    date: item.date,
                    created: item.created,
                    admin: item.admin
                };

                if (new Date(item.date) > now) {
                    active.push(countdown);
                } else {
                    past.push(countdown);
                }
            });

            return { active, past };
        } catch (error) {
            throw error;
        }
    }
);

export const fetchCountdown = createAsyncThunk(
    'countdown/fetchCountdown',
    async (id: string) => {
        try {
            if (!pb.authStore.isValid) {
                throw new Error('Authentication required');
            }

            const record = await pb.collection('countdown').getOne(id, {
                expand: 'admin'
            });
            return {
                id: record.id,
                title: record.Title,
                date: record.Date,
                created: record.created,
                admin: record.admin
            };
        } catch (error) {
            throw error;
        }
    }
);

export const createCountdown = createAsyncThunk(
    'countdown/createCountdown',
    async ({ title, endDate }: { title: string; endDate: string }) => {
        try {
            if (!pb.authStore.isValid) {
                throw new Error('Authentication required');
            }

            const record = await pb.collection('countdown').create({
                title: title,
                date: new Date(endDate).toISOString(),
                admin: pb.authStore.model?.id
            });
            return {
                id: record.id,
                title: record.Title,
                date: record.Date,
                created: record.created,
                admin: record.admin
            };
        } catch (error) {
            throw error;
        }
    }
);

const countdownSlice = createSlice({
    name: 'countdown',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountdowns.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCountdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeCountdowns = action.payload.active;
                state.pastCountdowns = action.payload.past;
            })
            .addCase(fetchCountdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch countdowns';
            })
            .addCase(fetchCountdown.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCountdown.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentCountdown = action.payload;
            })
            .addCase(fetchCountdown.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch countdown';
            })
            .addCase(createCountdown.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCountdown.fulfilled, (state, action) => {
                state.isLoading = false;
                const countdown = {
                    id: action.payload.id,
                    title: action.payload.title,
                    date: action.payload.date,
                    created: action.payload.created,
                    admin: pb.authStore.model?.id || ''
                };
                
                if (new Date(action.payload.date) > new Date()) {
                    state.activeCountdowns.push(countdown);
                } else {
                    state.pastCountdowns.push(countdown);
                }
            })
            .addCase(createCountdown.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create countdown';
            });
    },
});

export default countdownSlice.reducer;