import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
import clinicReducer from "./clinicSlice";
import appointmentsReducer from "./appointmentSlice";
import insuranceReducer from "./insuranceSlice";
import postsReducer from './postSlice'; // Import the posts reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    clinics: clinicReducer,
    appointments: appointmentsReducer,
    insurance: insuranceReducer,
    posts: postsReducer, // Add the posts reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;