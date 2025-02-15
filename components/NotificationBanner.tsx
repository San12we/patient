import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from './Shared/Colors';

interface NotificationBannerProps {
  title: string;
  message: string;
  onHide: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  title,
  message,
  onHide,
  duration = 3000,
  type = 'info'
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20,
        friction: 5
      }),
      Animated.delay(duration),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => onHide());
  }, []);

  const backgroundColor = {
    success: Colors.SUCCESS || '#4caf50',
    error: Colors.ERROR || '#f44336',
    info: Colors.PRIMARY || '#2196f3'
  }[type];

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], backgroundColor }]}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // Account for status bar
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default NotificationBanner;
