import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDoctors = createAsyncThunk("doctors/getDoctors", async () => {
  const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
  return response.data;
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
    selectedDoctor: null, // Add selectedDoctor to the initial state
  },
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload; // Set the selected doctor
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedDoctor } = doctorSlice.actions; // Export the action
export default doctorSlice.reducer;
