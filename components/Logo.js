import React from "react";
import { Image, StyleSheet } from "react-native";
import logo from "../assets/images/icons/medical-symbol.png";
export default function Logo() {
  return (
    <Image
      source={logo}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
});