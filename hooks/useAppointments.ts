import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'react-native';

const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = useSelector((state) => state.auth.user.user._id);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (userId) {
                const response = await fetch(
                    `https://medplus-health.onrender.com/api/appointments/user/${userId}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const allData = await response.json();
                const appointmentsArray = Array.isArray(allData) ? allData : [];
                setAppointments(appointmentsArray);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Error fetching appointments');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                fetchAppointments();
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, [fetchAppointments]);

    useEffect(() => {
        if (userId) {
            fetchAppointments();
        }
    }, [userId, fetchAppointments]);

    return {
        appointments,
        loading,
        error,
        refetch: fetchAppointments
    };
};

export default useAppointments;
