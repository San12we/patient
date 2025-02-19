import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { theme } from "../../core/theme";
import { resetPassword, requestPasswordReset } from "../(services)/api/api"; // Import the requestPasswordReset function
import CustomToast from "../../components/CustomToast"; // Import CustomToast

interface State {
  value: string;
  error: string;
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<State>({ value: "", error: "" });
  const [verificationCode, setVerificationCode] = useState<State>({ value: "", error: "" });
  const [newPassword, setNewPassword] = useState<State>({ value: "", error: "" });
  const [step, setStep] = useState(1); // Add a state to manage the step
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const onRequestPasswordResetPressed = async () => {
    try {
      await requestPasswordReset(email.value);
      setToast({ message: "Password reset email sent!", type: "success" });
      setStep(2); // Move to the next step
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setToast({ message: error.response.data.error, type: "error" });
      } else {
        setToast({ message: "An error occurred. Please try again.", type: "error" });
      }
    }
  };

  const onResetPasswordPressed = async () => {
    try {
      const response = await resetPassword(email.value, verificationCode.value, newPassword.value);
      setToast({ message: "Password reset successfully!", type: "success" });
      router.replace("/auth/login");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setToast({ message: error.response.data.error, type: "error" });
      } else {
        setToast({ message: "An error occurred. Please try again.", type: "error" });
      }
    }
  };

  return (
    <Background>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <Header>Reset Password</Header>
      {step === 1 ? (
        <>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <Button mode="contained" onPress={onRequestPasswordResetPressed}>
            Request Password Reset
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Verification Code"
            returnKeyType="next"
            value={verificationCode.value}
            onChangeText={(text) => setVerificationCode({ value: text, error: "" })}
            error={!!verificationCode.error}
            errorText={verificationCode.error}
          />
          <TextInput
            label="New Password"
            returnKeyType="done"
            value={newPassword.value}
            onChangeText={(text) => setNewPassword({ value: text, error: "" })}
            error={!!newPassword.error}
            errorText={newPassword.error}
            secureTextEntry
          />
          <Button mode="contained" onPress={onResetPasswordPressed}>
            Reset Password
          </Button>
        </>
      )}
      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});