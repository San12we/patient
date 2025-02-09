import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

interface AppointmentDetails {
  id: string;
  doctor: {
    name: string;
    specialization: string;
    profileImage: string;
    location: string;
    consultationFee: number;
  };
  status: string;
  time: string;
  createdAt: string;
}

const AppointmentDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user.user._id);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(
          `https://medplus-health.onrender.com/api/appointments/${id}`
        );
        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Appointment not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.doctorCard}>
          <Image 
            source={{ uri: appointment.doctor.profileImage }} 
            style={styles.doctorImage} 
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {appointment.doctor.name}</Text>
            <Text style={styles.specialization}>{appointment.doctor.specialization}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow 
            icon="map-marker" 
            label="Location" 
            value={appointment.doctor.location} 
          />
          <DetailRow 
            icon="clock-outline" 
            label="Time" 
            value={appointment.time} 
          />
          <DetailRow 
            icon="currency-usd" 
            label="Consultation Fee" 
            value={`${appointment.doctor.consultationFee} KSH`} 
          />
          <DetailRow 
            icon="calendar" 
            label="Created" 
            value={new Date(appointment.createdAt).toLocaleDateString()} 
          />
          <StatusBadge status={appointment.status} />
        </View>

        {appointment.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => {/* Handle cancellation */}}
            >
              <Text style={styles.buttonText}>Cancel Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.rescheduleButton]}
              onPress={() => {/* Handle reschedule */}}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    <View style={styles.detailTexts}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const StatusBadge = ({ status }) => (
  <View style={[styles.statusBadge, status === 'confirmed' ? styles.confirmedBadge : styles.pendingBadge]}>
    <MaterialCommunityIcons 
      name={status === 'confirmed' ? 'check-circle' : 'clock-outline'} 
      size={20} 
      color={status === 'confirmed' ? '#059669' : '#D97706'} 
    />
    <Text style={[
      styles.statusText, 
      status === 'confirmed' ? styles.confirmedText : styles.pendingText
    ]}>
      {status.toUpperCase()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  specialization: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailTexts: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  confirmedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  confirmedText: {
    color: '#059669',
  },
  pendingText: {
    color: '#D97706',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  rescheduleButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
});

export default AppointmentDetails;
