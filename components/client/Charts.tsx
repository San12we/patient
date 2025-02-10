import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { LineChart, BarChart } from 'react-native-chart-kit';

const Charts = () => {
  const screenWidth = Dimensions.get('window').width;

  const labData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(29, 173, 155, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const healthMetrics = {
    labels: ['Heart Rate', 'Blood Pressure', 'Glucose', 'Cholesterol'],
    datasets: [
      {
        data: [72, 120, 90, 200],
        colors: [
          (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
          (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          (opacity = 1) => `rgba(230, 126, 34, ${opacity})`,
        ],
      },
    ],
  };

  return (
    <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      style={styles.chartsScrollView}
    >
      <View style={[styles.chartContainer, { width: screenWidth - 32 }]}>
        <Text style={styles.chartTitle}>Lab Data Analysis (Last 6 Months)</Text>
        <LineChart
          data={labData}
          width={screenWidth - 64}
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

      <View style={[styles.chartContainer, { width: screenWidth - 32 }]}>
        <Text style={styles.chartTitle}>Health Metrics Overview</Text>
        <BarChart
          data={healthMetrics}
          width={screenWidth - 64}
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
    </ScrollView>
  );
};

export default Charts;

const styles = StyleSheet.create({
  chartsScrollView: {
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
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
