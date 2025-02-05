
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import axios from 'axios';
import Colors from '../../components/Shared/Colors';

const InsuranceDetails: React.FC = () => {
  const { insuranceId } = useSearchParams();
  const [insuranceDetails, setInsuranceDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try {
        const response = await axios.get(`https://project03-rj91.onrender.com/insurance/${insuranceId}`);
        if (response.status === 200) {
          setInsuranceDetails(response.data);
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to load insurance details');
        setLoading(false);
      }
    };

    fetchInsuranceDetails();
  }, [insuranceId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insurance Details</Text>
      <Text style={styles.detailText}>Provider: {insuranceDetails.insuranceProvider}</Text>
      <Text style={styles.detailText}>Policyholder: {insuranceDetails.policyholderName}</Text>
      <Text style={styles.detailText}>Insurance Number: {insuranceDetails.insuranceNumber}</Text>
      <Text style={styles.detailText}>Effective Date: {insuranceDetails.effectiveDate}</Text>
      <Text style={styles.detailText}>Expiration Date: {insuranceDetails.expirationDate}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e3f6f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default InsuranceDetails;