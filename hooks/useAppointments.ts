import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'react-native';

const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userId = useSelector((state) => state.auth.user?.user?._id); // Prevents crash if user is null
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const fetchAppointments = useCallback(async () => {
        if (!userId) {
            setAppointments([]); // Clear appointments on logout
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://medplus-health.onrender.com/api/appointments/user/${userId}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const allData = await response.json();
            setAppointments(Array.isArray(allData) ? allData : []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Error fetching appointments');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return; // Prevents running effect if user is not logged in

        const subscription = AppState.addEventListener('change', (nextAppState) => {
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
    }, [userId, fetchAppointments]);

    useEffect(() => {
        if (userId) {
            fetchAppointments();
        } else {
            setAppointments([]); // Clears appointments if user logs out
        }
    }, [userId, fetchAppointments]);

    return {
        appointments,
        loading,
        error,
        refetch: fetchAppointments,
    };
};

export default useAppointments;
