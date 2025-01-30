import { useState, useEffect } from 'react';
import axios from 'axios';

interface Slot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBookable: boolean;
  recurrence: string;
  _id: string; // Use _id as the unique identifier for slots
}

interface UseScheduleHook {
  schedule: Record<string, Slot[]>; // Group slots by day
  fetchSchedule: (doctorId: string) => Promise<void>;
  updateSlot: (_id: string, updates: Partial<Slot>) => void;
  loading: boolean;
  error: string | null;
}

const useSchedule = (doctorId: string): UseScheduleHook => {
  const [schedule, setSchedule] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      fetchSchedule(doctorId);
    }
  }, [doctorId]);

  const fetchSchedule = async (doctorId: string) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${doctorId}`);
      console.log('Fetched schedule data:', response.data); // Log the fetched schedule data

      if (response.status === 200) {
        const transformedSchedule = Object.entries(response.data.schedules).reduce((acc, [day, slots]: [string, any[]]) => {
          acc[day] = slots.map(slot => ({
            ...slot,
            date: day,
            _id: slot._id.$oid, // Ensure _id is correctly extracted
          }));
          return acc;
        }, {} as Record<string, Slot[]>);
        setSchedule(transformedSchedule);
      }
      setLoading(false);
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.message : 'Failed to load schedule');
      setLoading(false);
    }
  };

  const updateSlot = (_id: string, updates: Partial<Slot>) => {
    setSchedule(prevSchedule => {
      const updatedSchedule = { ...prevSchedule };
      for (const day in updatedSchedule) {
        updatedSchedule[day] = updatedSchedule[day].map(slot =>
          slot._id === _id ? { ...slot, ...updates } : slot
        );
      }
      return updatedSchedule;
    });
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
