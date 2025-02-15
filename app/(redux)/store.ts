import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
import clinicReducer from "./clinicSlice";
import appointmentsReducer from "./appointmentSlice";
import insuranceReducer from "./insuranceSlice";
import postsReducer from './postSlice';
import notificationsReducer from './notificationSlice'; // Add this import

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    clinics: clinicReducer,
    appointments: appointmentsReducer,
    insurance: insuranceReducer,
    posts: postsReducer,
    notifications: notificationsReducer, // Add this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;