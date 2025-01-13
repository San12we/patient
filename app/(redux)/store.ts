
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
import clinicReducer from "./clinicSlice";
import appointmentsReducer from "./appointmentSlice";

import insuranceReducer from "./insuranceSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
  doctors: doctorReducer,
  clinics: clinicReducer,
  appointments: appointmentsReducer,
  insurance: insuranceReducer,
  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Export AppDispatch
export default store;