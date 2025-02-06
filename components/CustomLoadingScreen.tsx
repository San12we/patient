import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from './Shared/Colors';

interface CustomLoadingScreenProps {
  message?: string;
}

const CustomLoadingScreen: React.FC<CustomLoadingScreenProps> = ({ message = "Loading..." }) => {
  return (
    <BlurView intensity={20} tint="light" style={styles.loadingOverlay}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1738787053/caduceus_ckkjsy.png' }} // Replace with a reliable URL or local image
          style={styles.logo}
          onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
        />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // More transparent background
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80, // Reduced width
    height: 80, // Reduced height
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.PRIMARY,
  },
});

export default CustomLoadingScreen;