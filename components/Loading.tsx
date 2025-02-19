import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading: React.FC = () => {
  const animation = useRef<LottieView>(null);
  const [invalidDimensions, setInvalidDimensions] = useState(false);

  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play();
  }, []);

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
        ref={animation}
        style={styles.lottie}
        source={require('../assets/animations/loading3.json')}
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
    backgroundColor: '#eee',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Loading;
