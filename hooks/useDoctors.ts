import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "../app/(redux)/doctorSlice";

export const useDoctors = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(getDoctors()).then((action) => {
      if (action.payload) {
        console.log('Fetched doctors:', action.payload); // Log the fetched data
      }
    });
  }, [dispatch]);

  return { doctors, loading, error };
};
