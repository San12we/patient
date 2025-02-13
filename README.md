import React, { useState } from "react";
import { TouchableOpacity, View, Image, TextInput, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Button from "../../components/Button";
import { loginUser } from "../(services)/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginAction } from "..//(redux)/authSlice";
import { LoginImg, UserImg, PasswordImg } from "../../theme/Images";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passwordValidator";
import LoadingScreen from "../../screens/Loader/LoadingScreen"; // Import LoadingScreen

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
  imgInput: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  loginInput: {
    flex: 1,
    height: 40,
  },
  feedbackText: {
    color: 'red',
    marginBottom: 10,
  },
  forgetText: {
    alignSelf: 'flex-end',
    marginBottom: 20,
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

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  signupText: {
    color: '#007bff',
    marginTop: 20,

  },
});

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    setFeedback("");
    try {
      const response = await loginUser({ email: email.value, password: password.value });
      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userId", response.user._id);
        await AsyncStorage.setItem("professionalId", response.professionalId); // Update professionalId in AsyncStorage
        dispatch(loginAction({ user: response.user, token: response.token, professionalId: response.professionalId }));
        
        if (response.user.userType === "professional") {
          if (response.user.completedProfile) {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/(tabs)/profile");
          }
        } else {
          router.replace("/auth/register");
        }
      } else {
        setFeedback("Invalid email or password");
      }
    } catch (error) {
      setFeedback("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingScreen message="Signing in..." /> // Use LoadingScreen with custom message
      ) : (
        <ScrollView contentContainerStyle={styles.loginContainer}>
          <Image source={LoginImg} style={styles.loginImg} />
          <View style={styles.mainContainer}>
            <Text style={styles.welComeText}>Hello, {"\n"} Welcome back</Text>
            <View style={styles.loginInputView}>
              <Image source={UserImg} style={styles.imgInput} />
              <TextInput
                placeholder="Email"
                style={styles.loginInput}
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: "" })}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.loginInputView}>
              <Image source={PasswordImg} style={styles.imgInput} />
              <TextInput
                placeholder="Password"
                style={styles.loginInput}
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: "" })}
                secureTextEntry
              />
            </View>
            <View style={styles.forgotPassword}>
              <TouchableOpacity onPress={() => router.push("/auth/resetPassword")}>
                <Text style={styles.forgot}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.btn, loading && { backgroundColor: '#ccc' }]}
              onPress={onLoginPressed}
              disabled={loading}
            >
              <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign in"}</Text>
            </TouchableOpacity>
            <Text style={styles.contiueText}>or continue with</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace("/auth/register")}>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
}