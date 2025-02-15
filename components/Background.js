import React from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from "../core/theme";

export default function Background({ children }) {
  return (
    <LinearGradient
      colors={['#ffebbb', '#e0ffcd', '#fcffc1', '#1dad9b']}
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
