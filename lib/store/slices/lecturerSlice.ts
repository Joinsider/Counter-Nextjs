// lib/store/slices/lecturerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {pb} from '@/lib/pocketbase';

// Define the lecturer interface
export interface Lecturer {
  id: string;
  name: string;
  created: string;
  updated: string;
}

interface LecturerState {
  lecturers: Lecturer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LecturerState = {
  lecturers: [],
  status: 'idle',
  error: null
};

// Async thunks
export const fetchLecturers = createAsyncThunk(
  'lecturer/fetchLecturers',
  async () => {
    const records = await pb.collection('lecturer').getList(1, 50, {
      sort: 'name',
    });
    return records.items as unknown as Lecturer[];
  }
);

export const addLecturer = createAsyncThunk(
  'lecturer/addLecturer',
  async (name: string) => {
    const record = await pb.collection('lecturer').create({
      name: name.charAt(0).toUpperCase() + name.slice(1).trim(),
    });
    return record as unknown as Lecturer;
  }
);

const lecturerSlice = createSlice({
  name: 'lecturer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLecturers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLecturers.fulfilled, (state, action: PayloadAction<Lecturer[]>) => {
        state.status = 'succeeded';
        state.lecturers = action.payload;
        state.error = null;
      })
      .addCase(fetchLecturers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch lecturers';
      })
      .addCase(addLecturer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addLecturer.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addLecturer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add lecturer';
      });
  },
});

export default lecturerSlice.reducer;