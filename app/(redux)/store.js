import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
import clinicReducer from "./clinicSlice"; // Import the clinic reducer
import appointmentsReducer from "./appointmentSlice"; // Import the appointments reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    clinics: clinicReducer, // Add the clinic reducer
    appointments: appointmentsReducer, // Add the appointments reducer
  },
});

export default store;
