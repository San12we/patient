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
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { loginUser } from "../(services)/api/api";
import { loginAction } from "../(redux)/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendTokenToBackend } from '../../utils/sendTokenToBackend';
import { useNotification } from '../../context/NotificationsContext';
import LottieView from 'lottie-react-native';
import { emailValidator } from "@/helpers/emailValidator"; // Import emailValidator
import { passwordValidator } from "@/helpers/passwordValidator"; // Import passwordValidator

export default function Login({ navigation }) {
  const [getEmailId, setEmailId] = useState({ value: "", error: "" });
  const [getPassword, setPassword] = useState({ value: "", error: "" });
  const [getError, setError] = useState(false);
  const [throwError, setThrowError] = useState("");
  const [getDisabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { expoPushToken } = useNotification();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (loading && animation.current) {
      animation.current.play();
    }
  }, [loading]);

  const loginFunction = async () => {
    const emailError = emailValidator(getEmailId.value);
    const passwordError = passwordValidator(getPassword.value);
    if (emailError || passwordError) {
      setEmailId({ ...getEmailId, error: emailError });
      setPassword({ ...getPassword, error: passwordError });
      return;
    }

    setDisabled(true);
    setLoading(true);
    try {
      const userData = await loginUser({ email: getEmailId.value, password: getPassword.value });
      console.log('User Data:', userData);
      dispatch(loginAction(userData));
      setEmailId({ value: "", error: "" });
      setPassword({ value: "", error: "" });

      if (expoPushToken) {
        await sendTokenToBackend(userData.user._id, expoPushToken);
      }

      router.push("/(tabs)");
    } catch (err) {
      setDisabled(false);
      setLoading(false);
      setError(true);
      setThrowError("Sorry! User not found / Incorrect Password");
      setPassword({ value: "", error: "" });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <Image
          source={{ uri: "https://res.cloudinary.com/dws2bgxg4/image/upload/v1739456710/log_fjcgwt.jpg" }}
          style={styles.loginImg}
        />
        <View style={styles.mainContainer}>
          <Text style={styles.welComeText}>Hello, {"\n"} Welcome back</Text>
          <View style={styles.loginInputView}>
            <TextInput
              placeholder="Email"
              style={styles.loginInput}
              value={getEmailId.value}
              onChangeText={(text) => setEmailId({ value: text, error: "" })}
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          </View>
          {getEmailId.error ? <Text style={styles.feedbackText}>{getEmailId.error}</Text> : null}
          <View style={styles.loginInputView}>
            <TextInput
              placeholder="Password"
              style={styles.loginInput}
              value={getPassword.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              secureTextEntry
            />
          </View>
          {getPassword.error ? <Text style={styles.feedbackText}>{getPassword.error}</Text> : null}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/auth/resetPassword")}
          >
            <Text style={styles.forgotBtnText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, loading && { backgroundColor: '#ccc' }]}
            onPress={loginFunction}
            disabled={getDisabled}
          >
            <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign in"}</Text>
            {loading && (
              <LottieView
                autoPlay
                ref={animation}
                style={styles.lottieAnimation}
                source={require('../../assets/animations/loading.json')}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.contiueText}>or continue with</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/auth/register")}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loginImg: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  welComeText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  loginInput: {
    flex: 1,
    height: 40,
  },
  feedbackText: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotBtnText: {
    color: '#007bff',
  },
  btn: {
    width: '100%',
    padding: 15,
    backgroundColor: '#c5f0a4',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  contiueText: {
    marginBottom: 20,
    color: '#a9a9a9',
  },
  signupText: {
    color: '#007bff',
    marginTop: 20,
  },
  lottieAnimation: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});