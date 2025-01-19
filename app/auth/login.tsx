import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../(services)/api/api";
import { loginAction } from "../(redux)/authSlice";
import Background from "../../components/Background";
import Header from "../../components/Header";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
  useEffect(() => {
    if (user) {
      router.push("/(tabs)");
    }
  }, [user, router]);

  const sendTokenToBackend = async (token: string, userId: string) => {
    try {
        const response = await fetch('https://medplus-health.onrender.com/api/push-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to send push token to backend');
        }

        console.log('Push token sent to backend successfully');
    } catch (error) {
        console.error('Error sending push token to backend:', error);
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await mutation.mutateAsync(values);
      dispatch(loginAction(data));
      const token = await AsyncStorage.getItem('expoPushToken');
      if (token) {
        sendTokenToBackend(token, data.userId); // Send the token to the backend with userId
      }
      router.push("/(tabs)");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LinearGradient
      colors={['#ffebbb', '#e0ffcd', '#fcffc1', '#1dad9b']}
      style={styles.background}
    >
      <Background>
        <Logo />
        
        <Formik
          initialValues={{ email: "user@gmail.com", password: "123456" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <TextInput
                label="Email"
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                error={errors.email && touched.email ? errors.email : null}
                errorText={errors.email && touched.email ? errors.email : ""}
                description=""
              />
              <TextInput
                label="Password"
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
                error={errors.password && touched.password ? errors.password : null}
                errorText={errors.password && touched.password ? errors.password : ""}
                description=""
              />
              <View style={styles.forgotPassword}>
                <TouchableOpacity onPress={() => router.push("/auth/resetPassword")}>
                  <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>
              <Button mode="contained" onPress={handleSubmit} disabled={mutation.status === 'pending'} style={{ marginTop: 16 }}>
                {mutation.status === 'pending' ? 'Logging in...' : 'Login'}
              </Button>
              <View style={styles.row}>
                <Text>You do not have an account yet?</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => router.replace("/auth/register")}>
                  <Text style={styles.link}>Create!</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </Background>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  form: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgot: {
    fontSize: 13,
    color: "#6200ee",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: "#6200ee",
  },
});
