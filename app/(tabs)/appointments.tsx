import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAppointments from '../../hooks/useAppointments';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Doctor {
  name: string;
  specialization: string;
  profileImage: string;
  location: string;
  consultationFee: number;
}

interface Appointment {
  id: string; // Changed from _id to id
  doctor: Doctor;
  status: string;
  time: string;
  createdAt: string;
}

const NotificationsScreen: React.FC = () => {
  const { appointments = [], loading, error } = useAppointments();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders'>('appointments');
  const [activeStatus, setActiveStatus] = useState<'confirmed' | 'pending'>('confirmed');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => app.status === activeStatus);
  }, [appointments, activeStatus]);

  const TabButton = ({ title, icon, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTabButton]} 
      onPress={onPress}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={isActive ? '#007AFF' : '#6B7280'} 
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.tabBar}>
        <TabButton 
          title="Appointments" 
          icon="calendar-clock"
          isActive={activeTab === 'appointments'}
          onPress={() => setActiveTab('appointments')}
        />
        <TabButton 
          title="Orders" 
          icon="shopping"
          isActive={activeTab === 'orders'}
          onPress={() => setActiveTab('orders')}
        />
      </View>
      
      {activeTab === 'appointments' && (
        <View style={styles.segmentedControl}>
          <TouchableOpacity 
            style={[styles.segment, activeStatus === 'confirmed' && styles.activeSegment]}
            onPress={() => setActiveStatus('confirmed')}
          >
            <Text style={[styles.segmentText, activeStatus === 'confirmed' && styles.activeSegmentText]}>
              Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.segment, activeStatus === 'pending' && styles.activeSegment]}
            onPress={() => setActiveStatus('pending')}
          >
            <Text style={[styles.segmentText, activeStatus === 'pending' && styles.activeSegmentText]}>
              Pending ({appointments.filter(a => a.status === 'pending').length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderAppointmentCard = ({ item }) => (
    <Animated.View 
      entering={FadeInRight} 
      layout={Layout.springify()}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
      >
        <Image source={{ uri: item.doctor.profileImage }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Dr. {item.doctor.name}</Text>
          <Text style={styles.specialization}>{item.doctor.specialization}</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{item.doctor.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock" size={16} color="#6B7280" />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            
          >
            <Text style={styles.viewButtonText}>View Details</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {activeTab === 'appointments' ? (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-blank" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No {activeStatus} appointments</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="shopping" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeSegmentText: {
    color: '#007AFF',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 30,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#ebf0f7',
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: 'center',
    color: '#3399ff',
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#6666ff',
  },
  time: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#ff6347',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 150,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#007BFF',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
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
    fontSize: 18,
    color: 'red',
  },
  contentList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  specialization: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 8,
  },
});

export default NotificationsScreen;
