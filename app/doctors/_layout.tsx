import { Stack } from 'expo-router';

export default function DoctorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Screen for doctors overview */}
      <Stack.Screen name="index" options={{ title: 'Doctors Overview' }} />

      {/* Dynamic route for doctor profile based on doctorId */}
      <Stack.Screen name="[doctorId]" options={{ title: 'Doctor Profile' }} />
    </Stack>
  );
}
