import { StyleSheet, View } from 'react-native';
import React from 'react';
// Import the Stack from expo-router
import { Stack } from 'expo-router';
// Import LinearGradient from expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';

const _layout = () => {
  return (
    <LinearGradient colors={['#e0ffcd', '#ffebbb', '#1dad9b', '#fcffc1']} style={styles.background}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Consultation",
            }}
          />
          <Stack.Screen
            name="details/index"
            options={{
              title: "Consultation Details",
            }}
          />
        </Stack>
      </View>
    </LinearGradient>
  );
};

export default _layout;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
