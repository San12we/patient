import { StyleSheet } from 'react-native';
import React from 'react';
// Import the Drawer from expo-router
import { Drawer } from 'expo-router/drawer';
// Import vector icons
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const _layout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Profile",
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="insurance/index"
        options={{
          drawerLabel: "Insurance",
          title: "Insurance",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
};

export default _layout;

const styles = StyleSheet.create({});
