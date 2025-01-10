import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useInsurance = () => {
  const [insuranceProviders, setInsuranceProviders] = useState([]);

  const fetchInsuranceProviders = async () => {
    try {
      const response = await fetch("https://project03-rj91.onrender.com/insurance");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setInsuranceProviders(data);

      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching insurance providers:", error);
    }
  };

  const clearCacheAndFetchAfresh = async () => {
    try {
      await AsyncStorage.removeItem("insuranceProviders");
      await fetchInsuranceProviders();
    } catch (error) {
      console.error("Error clearing cache and fetching afresh:", error);
    }
  };

  useEffect(() => {
    fetchInsuranceProviders();
  }, []);

  return { insuranceProviders, clearCacheAndFetchAfresh };
};

export default useInsurance;