import { StyleSheet } from 'react-native';
import React from 'react';

import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="insurance/index"
        options={{
          title: "Insurance",
        }}
      />
      <Stack.Screen
        name="edit/index"
        options={{
          title: "Edit Profile",
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
