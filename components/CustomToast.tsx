import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import Colors from './Shared/Colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide?: () => void;
}

const CustomToast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; // Start from bottom
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Slide in and fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start(() => {
      // Slide out and fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => onHide?.());
    });
  }, []);

  const backgroundColor = {
    success: Colors.primary, // Green for success
    error: '#ff4444', // Red for error
    info: Colors.GRAY, // Blue for info
  }[type];

  const iconName = {
    success: 'checkmark-circle',
    error: 'warning',
    info: 'information-circle',
  }[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Icon */}
      <Ionicons
        name={iconName}
        size={24}
        color="white"
        style={styles.icon}
      />

      {/* Message */}
      <Text style={styles.text}>{message}</Text>

      {/* Progress Bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
});

export default CustomToast;