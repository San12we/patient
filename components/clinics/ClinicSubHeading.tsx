import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../Shared/Colors';

interface ClinicSubHeadingProps {
  subHeadingTitle: string;
}

const ClinicSubHeading: React.FC<ClinicSubHeadingProps> = ({ subHeadingTitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subHeadingTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // Use a simple font with no loading
    fontFamily: 'System',
  },
});

export default ClinicSubHeading;