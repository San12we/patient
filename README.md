import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';

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
    if (doctorId) {
      console.log('Fetching schedule for doctorId:', doctorId);
      fetchSchedule();
    }
  }, [doctorId]);

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${doctorId}`);
      console.log('Fetched schedule data:', response.data); // Log the fetched schedule data

      if (response.status === 200) {
        const scheduleData = response.data;
        const currentDate = moment();

        // Compute dates for each day of the week
        const dayToDateMap: Record<string, string> = {};
        for (let i = 0; i < 7; i++) {
          const date = currentDate.clone().add(i, 'days');
          const dayOfWeek = date.format('dddd');
          dayToDateMap[dayOfWeek] = date.format('YYYY-MM-DD');
        }

        // Assign dates to each slot
        const updatedSchedule: Record<string, Slot[]> = {};
        for (const [day, slots] of Object.entries(scheduleData)) {
          updatedSchedule[day] = slots.map((slot) => ({
            ...slot,
            date: dayToDateMap[day], // Assign the computed date
          }));
        }

        console.log('Processed schedule data:', updatedSchedule); // Log the processed schedule data
        setSchedule(updatedSchedule);
      }
      setLoading(false);
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.message : 'Failed to load schedule');
      setLoading(false);
    }
  }, [doctorId]);

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



import axios from 'axios';
import moment from 'moment';

export const fetchSubaccountCode = async (doctorId: string): Promise<string | null> => {
  try {
    const response = await axios.get(`https://medplus-health.onrender.com/api/doctors/${doctorId}/subaccount`);
    return response.data.subaccountCode;
  } catch (error) {
    console.error('Error fetching subaccount code:', error);
    return null;
  }
};

export const bookAppointment = async (
  doctorId: string,
  userId: string,
  patientName: string,
  selectedDate: Date,
  timeSlotId: string | null,
  selectedInsurance: string | undefined,
  subaccountCode: string | null,
  userEmail: string,
  consultationFee: number,
  withInsurance: boolean,
  selectedTime: string | undefined, // Added selectedTime parameter
  skipPayment: boolean = false // Add skipPayment parameter with default value
): Promise<string> => {
  try {
    const response = await axios.post('https://medplus-health.onrender.com/api/appointments', {
      doctorId,
      userId,
      patientName,
      selectedDate,
      timeSlotId,
      selectedInsurance,
      subaccountCode,
      userEmail,
      consultationFee,
      withInsurance,
      selectedTime, // Include selectedTime in the payload
      skipPayment, // Include skipPayment in the payload
    });
    return response.data.appointmentId;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

export const confirmAppointment = async (appointmentId: string): Promise<void> => {
  try {
    await axios.put(`https://medplus-health.onrender.com/api/appointments/${appointmentId}/confirm`);
  } catch (error) {
    console.error('Error confirming appointment:', error);
    throw error;
  }
};
