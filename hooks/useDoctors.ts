import { useSelector } from "react-redux";

export const useDoctors = () => {
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  return { doctors, loading, error };
};
