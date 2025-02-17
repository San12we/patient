import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { loginUser } from "../(services)/api/api";
import { loginAction } from "../(redux)/authSlice";
import { sendTokenToBackend } from '../../utils/sendTokenToBackend';
import { useNotification } from '../../context/NotificationsContext';
import { emailValidator } from "../../helpers/emailValidator"; // Combined validators
import { passwordValidator } from "../../helpers/passwordValidator";

export default function Login() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { fcmToken, showNotification } = useNotification(); // Use fcmToken from context

  const handleLogin = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail((prev) => ({ ...prev, error: emailError }));
      setPassword((prev) => ({ ...prev, error: passwordError }));
      return;
    }

    setIsLoading(true);
    try {
      const userData = await loginUser({ email: email.value, password: password.value });
      dispatch(loginAction(userData));

      if (fcmToken) {
        await sendTokenToBackend(userData.user._id, fcmToken); // Send FCM token to backend
      }

      router.push("/(tabs)");
    } catch (err) {
      setError(true);
      setErrorMessage("Sorry! User not found / Incorrect Password");
      showNotification({
        title: 'Error',
        message: err.message || 'Login failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dws2bgxg4/image/upload/v1739456710/log_fjcgwt.jpg" }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Hello, {"\n"} Welcome back</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            {email.error ? <Text style={styles.errorText}>{email.error}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              secureTextEntry
            />
            {password.error ? <Text style={styles.errorText}>{password.error}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/auth/resetPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.orText}>or continue with</Text>
          <TouchableOpacity onPress={() => router.replace("/auth/register")}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#c5f0a4',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  orText: {
    marginBottom: 20,
    color: '#a9a9a9',
  },
  signupText: {
    color: '#007bff',
  },
});