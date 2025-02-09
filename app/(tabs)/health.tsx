import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const health = () => {
  const router = useRouter();

  const segments = [
    { title: 'Consultations', route: '/consultation', icon: <MaterialIcons name="medical-services" size={24} color="#1dad9b" /> },
    { title: 'Labs Reports', route: '/labs', icon: <FontAwesome5 name="vial" size={24} color="#1dad9b" /> },
    { title: 'Diagnosis', route: '/diagnosis', icon: <Ionicons name="document-text" size={24} color="#1dad9b" /> },
    { title: 'Health Monitor', route: '/monitor', icon: <Feather name="activity" size={24} color="#1dad9b" /> },
  ];

  const screenWidth = Dimensions.get('window').width;

  // Lab Data Analysis (Line Chart)
  const labData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(29, 173, 155, ${opacity})`, // Line color
        strokeWidth: 2, // Line thickness
      },
    ],
  };

  // Health Metrics (Bar Chart)
  const healthMetrics = {
    labels: ['Heart Rate', 'Blood Pressure', 'Glucose', 'Cholesterol'],
    datasets: [
      {
        data: [72, 120, 90, 200],
        colors: [
          (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Heart Rate
          (opacity = 1) => `rgba(75, 123, 236, ${opacity})`, // Blood Pressure
          (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Glucose
          (opacity = 1) => `rgba(230, 126, 34, ${opacity})`, // Cholesterol
        ],
      },
    ],
  };

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

        {/* Lab Data Analysis (Line Chart) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Lab Data Analysis (Last 6 Months)</Text>
          <LineChart
            data={labData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(29, 173, 155, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#1dad9b',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Health Metrics (Bar Chart) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Health Metrics Overview</Text>
          <BarChart
            data={healthMetrics}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barColors: healthMetrics.datasets[0].colors,
            }}
            style={styles.chart}
          />
        </View>
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
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1dad9b',
  },
  chart: {
    borderRadius: 16,
  },
});