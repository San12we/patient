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
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import CustomBox from "react-native-customized-box";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { loginUser } from "../(services)/api/api";
import { loginAction } from "../(redux)/authSlice";
import Colors from "@/components/Shared/Colors";
import { theme } from "@/constants/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendTokenToBackend } from '../../utils/sendTokenToBackend';
import { useNotification } from '../../context/NotificationsContext';
import LottieView from 'lottie-react-native'; // Import LottieView

export default function Login({ navigation }) {
  const [getEmailId, setEmailId] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getError, setError] = useState(false);
  const [throwError, setThrowError] = useState("");
  const [getDisabled, setDisabled] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { expoPushToken } = useNotification();
  const animation = useRef<LottieView>(null); // Add ref for LottieView

  useEffect(() => {
    if (loading && animation.current) {
      animation.current.play();
    }
  }, [loading]);

  const loginFunction = async () => {
    setDisabled(true);
    setLoading(true);
    if (getEmailId === "") {
      setEmailError("*This is Required");
    }
    if (getPassword === "") {
      setPasswordError("*This is Required");
    }
    if (getEmailId !== "" && getPassword !== "") {
      try {
        const userData = await loginUser({ email: getEmailId, password: getPassword });
        console.log('User Data:', userData); // Log userData
        dispatch(loginAction(userData));
        setEmailId("");
        setPassword("");

        // Send the token to the backend
        if (expoPushToken) {
          await sendTokenToBackend(userData.user._id, expoPushToken); // Pass the correct userId and token from the context
        }

        router.push("/(tabs)");
      } catch (err) {
        setDisabled(false);
        setLoading(false);
        setError(true);
        setThrowError("Sorry! User not found / Incorrect Password");
        setPassword("");
      }
    } else {
      setDisabled(false);
      setLoading(false);
      setError(true);
      setThrowError("Please Enter the Email and Password carefully");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Image
            style={styles.loginImage}
            source={{
              uri: "https://res.cloudinary.com/dws2bgxg4/image/upload/v1734536854/medplus/biif68j04kajkkwqub0r.png",
            }}
          />
          {getError ? (
            <View style={styles.errorCard}>
              <TouchableOpacity
                style={styles.cross}
                onPress={() => {
                  setError(false);
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
              <Text style={styles.errorCardText}>{throwError}</Text>
            </View>
          ) : null}
          <CustomBox
            placeholder={"Email"}
            boxColor={"dodgerblue"}
            focusColor={"#e65c40"}
            keyboardType="email-address"
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
            }}
            labelConfig={{
              text: "Email",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            requiredConfig={{
              text: <Text>{emailError}</Text>,
            }}
            values={getEmailId}
            onChangeText={(value) => {
              setEmailId(value);
              setError(false);
              setEmailError("");
            }}
          />
          <CustomBox
            placeholder={"Password"}
            toggle={true}
            boxColor={"dodgerblue"}
            focusColor={"#e65c40"}
            boxStyle={{ borderRadius: 40, borderWidth: 2 }}
            inputStyle={{
              fontWeight: "bold",
              color: "#30302e",
              paddingLeft: 20,
              borderRadius: 40,
            }}
            labelConfig={{
              text: "Password",
              style: {
                color: "#0e0e21",
                fontWeight: "bold",
              },
            }}
            requiredConfig={{
              text: <Text>{passwordError}</Text>,
            }}
            values={getPassword}
            onChangeText={(value) => {
              setPassword(value);
              setError(false);
              setPasswordError("");
            }}
          />
          {/* ForgotPassword */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => {
              router.push("/auth/resetPassword");
            }}
          >
            <Text style={styles.forgotBtnText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={loginFunction}
            disabled={getDisabled}
          >
            <Text style={styles.loginBtnText}>LogIn</Text>
            {loading && (
              <LottieView
                autoPlay
                ref={animation}
                style={styles.lottieAnimation}
                source={require('../../assets/animations/loading.json')}
              />
            )}
          </TouchableOpacity>

          {/* Register Button */}
          <View style={styles.createAccount}>
            <Text style={styles.createAccountText}>
              {`Don't have an Account? `}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/auth/register")}>
              <Text style={styles.link}>Create!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    color: Colors.primary,
  },
  errorCard: {
    width: 300,
    height: 50,
    backgroundColor: "#de3138",
    justifyContent: "center",
    paddingLeft: 15,
    borderRadius: 40,
  },
  errorCardText: {
    paddingLeft: 15,
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    position: "absolute",
  },
  cross: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    left: 250,
    position: "relative",
  },
  loginImage: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  loginBtn: {
    marginTop: 10,
    backgroundColor: Colors.SECONDARY,
    width: 300,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loginBtnText: {
    color: "white",
    fontSize: 22,
  },
  forgotBtn: {
    marginTop: -20,
    width: 280,
    height: 20,
    justifyContent: "center",
  },
  forgotBtnText: {
    color: "#c29700",
    fontSize: 12,
    alignSelf: "flex-end",
    textDecorationLine: "underline",
  },
  createAccount: {
    marginTop: 10,
    width: 280,
    height: 20,
    flexDirection: "row",
  },
  createAccountText: {
    color: "grey",
  },
  lottieAnimation: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
});