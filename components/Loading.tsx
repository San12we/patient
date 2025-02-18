import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop
        style={styles.lottie}
        source={require('../assets/animations/loading2.json')}
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
});

export default Loading;
