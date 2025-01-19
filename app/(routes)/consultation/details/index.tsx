import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const ConsultationDetail = () => {
    const route = useRoute();
    const { consultation } = route.params;

    if (!consultation) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.noResults}>Consultation not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <LinearGradient colors={['#e0ffcd', '#ffebbb', '#1dad9b', '#fcffc1']} style={styles.background}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: consultation.doctor.profileImage }}
                            style={styles.profileImage}
                        />
                        <View style={styles.headerDetails}>
                            <Text style={styles.name}>{consultation.doctor.name}</Text>
                            <Text style={styles.specialization}>
                                {consultation.doctor.specialization}
                            </Text>
                            <Text style={styles.location}>
                                📍 {consultation.doctor.location}
                            </Text>
                            <Text style={styles.fee}>
                                💵 {consultation.doctor.consultationFee} KSH
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statusContainer}>
                        <Text
                            style={[
                                styles.status,
                                consultation.status === 'pending'
                                    ? styles.pending
                                    : styles.confirmed,
                            ]}
                        >
                            {consultation.status.toUpperCase()}
                        </Text>
                        <Text style={styles.date}>
                            Created: {new Date(consultation.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    {[
                        { title: 'Description', content: consultation.description },
                        {
                            title: 'Diagnosis',
                            content: consultation.diagnosis || 'No diagnosis available',
                        },
                        {
                            title: 'Prescriptions',
                            content:
                                consultation.prescriptions?.join('\n') ||
                                'No prescriptions available',
                        },
                        {
                            title: 'Tests',
                            content: consultation.tests?.join('\n') || 'No tests available',
                        },
                        {
                            title: 'Reports',
                            content: consultation.reports?.join('\n') || 'No reports available',
                        },
                        {
                            title: "Doctor's Notes",
                            content: consultation.doctorNotes || 'No notes available',
                        },
                    ].map((section, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.description}>{section.content}</Text>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default ConsultationDetail;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container: {
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResults: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    headerDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    specialization: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    location: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    fee: {
        fontSize: 14,
        color: '#28a745',
        marginTop: 4,
        fontWeight: 'bold',
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    pending: {
        backgroundColor: '#ffc107',
        color: '#fff',
    },
    confirmed: {
        backgroundColor: '#28a745',
        color: '#fff',
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
});
