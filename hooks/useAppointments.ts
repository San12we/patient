import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
    setAppointments,
    setError,
    setLoading,
    setUpcomingAppointments,
    setRequestedAppointments,
    setCompletedAppointments,
    selectAppointments,
} from '../app/(redux)/appointmentSlice';
import { selectUser } from '../app/(redux)/authSlice';

const useAppointments = () => {
    const dispatch = useDispatch();
    const appointments = useSelector(selectAppointments);
    const { loading, error } = useSelector((state) => state.appointments || {});
    const user = useSelector(selectUser);
    const userId = user?.userId;

    useEffect(() => {
        const fetchAppointments = async () => {
            dispatch(setLoading(true));
            dispatch(setError(null));
        
            try {
                if (userId) {
                    const response = await fetch(`https://medplus-health.onrender.com/api/appointments/user/${userId}`);
                    const allData = await response.json();
                    const appointmentsArray = Array.isArray(allData) ? allData : [];
                    dispatch(setAppointments(appointmentsArray));
        
                    const now = moment();
        
                    const upcomingAppointments = appointmentsArray.filter(
                        (appointment) =>
                            appointment.status === 'confirmed' &&
                            moment(appointment.date).isSameOrAfter(now, 'day')
                    );
        
                    const requestedAppointments = appointmentsArray.filter((appointment) => appointment.status === 'pending');
                    const completedAppointments = appointmentsArray.filter((appointment) => appointment.status === 'completed');
        
                    dispatch(setUpcomingAppointments(upcomingAppointments));
                    dispatch(setRequestedAppointments(requestedAppointments));
                    dispatch(setCompletedAppointments(completedAppointments));
                }
            } catch (err) {
                console.error('Error fetching appointments:', err.message);
                dispatch(setError('Error fetching appointments'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (userId) {
            fetchAppointments();
        }
    }, [dispatch, userId]);

    const confirmAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `https://medplus-health.onrender.com/api/appointments/confirm/${appointmentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                dispatch(setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment._id === appointmentId ? { ...appointment, status: 'confirmed' } : appointment
                    )
                ));
            } else {
                throw new Error('Failed to confirm appointment');
            }
        } catch (err) {
            console.error(err);
            dispatch(setError('Error confirming appointment'));
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `https://medplus-health.onrender.com/api/appointments/cancel/${appointmentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                dispatch(setAppointments((prev) =>
                    prev.filter((appointment) => appointment._id !== appointmentId)
                ));
            } else {
                throw new Error('Failed to cancel appointment');
            }
        } catch (err) {
            console.error(err);
            dispatch(setError('Error cancelling appointment'));
        }
    };

    return {
        appointments,
        loading,
        error,
        confirmAppointment,
        cancelAppointment,
    };
};

export default useAppointments;
