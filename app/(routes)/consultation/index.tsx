import { 
    StyleSheet, 
    Text, 
    View, 
    SafeAreaView, 
    FlatList, 
    TextInput, 
    Image, 
    Platform 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../app/(redux)/authSlice';

const Index = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.auth.user.user._id);

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                if (userId) {
                    const response = await fetch(
                        `https://medplus-health.onrender.com/api/appointments/user/${userId}`
                    );
                    const allData = await response.json();
                    const appointmentsArray = Array.isArray(allData) ? allData : [];
                    setAppointments(appointmentsArray);
                    setFilteredAppointments(appointmentsArray);
                }
            } catch (err) {
                console.error('Error fetching appointments:', err.message);
                setError('Error fetching appointments');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAppointments();
        }
    }, [userId]);

    useEffect(() => {
        const filtered = appointments.filter((item) => {
            const query = searchQuery.toLowerCase();
            return (
                item.doctor.name.toLowerCase().includes(query) ||
                item.doctor.specialization.toLowerCase().includes(query) ||
                item.doctor.location.toLowerCase().includes(query)
            );
        });
        setFilteredAppointments(filtered);
    }, [searchQuery, appointments]);

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.doctor.profileImage }} style={styles.profileImage} />
            <View style={styles.details}>
                <Text style={styles.name}>{item.doctor.name}</Text>
                <Text style={styles.specialization}>{item.doctor.specialization}</Text>
                <Text style={styles.location}>📍 {item.doctor.location}</Text>
                <Text style={styles.fee}>💵 {item.doctor.consultationFee} KSH</Text>
                <Text style={[styles.status, item.status === 'pending' ? styles.pending : styles.confirmed]}>
                    {item.status.toUpperCase()}
                </Text>
                <Text style={styles.date}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.title}>My Appointments</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by doctor, specialization, or location"
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <View style={styles.container}>
                {loading ? (
                    <Text style={styles.loading}>Loading...</Text>
                ) : error ? (
                    <Text style={styles.error}>Error: {error}</Text>
                ) : filteredAppointments.length > 0 ? (
                    <FlatList
                        data={filteredAppointments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCard}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noResults}>No appointments found</Text>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android status bar
    },
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontSize: 14,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    specialization: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    fee: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginVertical: 4,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    pending: {
        color: '#FFC107',
    },
    confirmed: {
        color: '#4CAF50',
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    loading: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: '#f00',
        textAlign: 'center',
        marginTop: 20,
    },
    noResults: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});
