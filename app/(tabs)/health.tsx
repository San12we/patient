import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import Posts from '@/components/client/Posts';
import Charts from '@/components/client/Charts';

const health = () => {
  const router = useRouter();

  const segments = [
    { title: 'Consultations', route: '/consultation', icon: <MaterialIcons name="medical-services" size={24} color="#1dad9b" /> },
    { title: 'Labs Reports', route: '/labs', icon: <FontAwesome5 name="vial" size={24} color="#1dad9b" /> },
    { title: 'Diagnosis', route: '/diagnosis', icon: <Ionicons name="document-text" size={24} color="#1dad9b" /> },
    { title: 'Health Monitor', route: '/monitor', icon: <Feather name="activity" size={24} color="#1dad9b" /> },
  ];

  return (
    <LinearGradient colors={['#bae8e8', '#faf9f9', '#ffffff', '#1dad9b']} style={styles.background}>
      <View style={styles.container}>
        <ScrollView horizontal contentContainerStyle={styles.segmentsContainer} showsHorizontalScrollIndicator={false}>
          {segments.map((segment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.segment}
              onPress={() => router.push(segment.route)}
            >
              {segment.icon}
              <Text style={styles.segmentText}>{segment.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ClinicSubHeading subHeadingTitle='For You' />
        <Charts />

        <ClinicSubHeading subHeadingTitle='Explore Insights' />
        <Posts />
      </View>
    </LinearGradient>
  );
};

export default health;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  segmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  segment: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});