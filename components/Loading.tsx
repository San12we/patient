import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading: React.FC = () => {
  const [invalidDimensions, setInvalidDimensions] = useState(false);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    if (width === 0 || height === 0) {
      console.error('Invalid Lottie animation dimensions');
      setInvalidDimensions(true);
    }
  };

  if (invalidDimensions) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading animation failed to load.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop
        style={styles.lottie}
        source={require('../assets/animations/loading2.json')}
        onLayout={handleLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Loading;
