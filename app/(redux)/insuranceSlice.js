import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchInsuranceProviders = createAsyncThunk(
  'insurance/fetchInsuranceProviders',
  async () => {
    const response = await fetch("https://project03-rj91.onrender.com/insurance");
    const data = await response.json();
    return data;
  }
);

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState: {
    insuranceProviders: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsuranceProviders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInsuranceProviders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.insuranceProviders = action.payload;
      })
      .addCase(fetchInsuranceProviders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default insuranceSlice.reducer;
