import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Slot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBookable: boolean;
  recurrence: string;
  _id: string; // Use _id as the unique identifier for slots
}

interface UseScheduleHook {
  schedule: Record<string, Slot[]>; // Use a record of slots grouped by day
  fetchSchedule: () => Promise<void>;
  updateSlot: (_id: string, updates: Partial<Slot>) => void;
  loading: boolean;
  error: string | null;
}

const useSchedule = (doctorId: string, userId: string): UseScheduleHook => {
  const [schedule, setSchedule] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId && userId) {
      console.log('Fetching schedule for userId:', userId);
      fetchSchedule();
    }
  }, [doctorId, userId]);

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${userId}`);
      console.log('Fetched schedule data:', response.data); // Log the fetched schedule data

      if (response.status === 200) {
        setSchedule(response.data);
      }
      setLoading(false);
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.message : 'Failed to load schedule');
      setLoading(false);
    }
  }, [doctorId, userId]);

  const updateSlot = async (_id: string, updates: Partial<Slot>) => {
    try {
      await axios.put(`https://medplus-health.onrender.com/api/schedule/slot/${_id}`, updates);
      fetchSchedule();
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    schedule,
    fetchSchedule,
    updateSlot,
    loading,
    error,
  };
};

export default useSchedule;
