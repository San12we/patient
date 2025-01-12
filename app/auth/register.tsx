import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { registerUser } from "../(services)/api/api";

import axios from "axios";
import TextInput from "@/components/TextInput";
import Background from "@/components/Background";
import Logo from "@/components/Logo";
import Loader from "@/components/Loader";
import { Image } from "react-native";
import Button from "@/components/Header";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  useEffect(() => {
    if (timerActive && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setTimerActive(false);
    }
  }, [timerActive, countdown]);

  return (
    <Background>
      <Logo />
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ justifyContent: 'center', alignContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Image source={{ uri: imageUrl }} style={{ width: '50%', height: 100, resizeMode: 'contain', margin: 30 }} />
        </View>
        <KeyboardAvoidingView enabled>
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              firstName: "",
              lastName: "",
              userType: "patient", // Default userType
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values: RegisterValues) => {
              const data = {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                userType: values.userType, // Include userType in payload
              };
              setLoading(true);
              mutation.mutateAsync(data)
                .then(() => {
                  setMessage("Registration successful! Please check your email for verification.");
                  setMessageType("success");
                  setIsVerifying(true);
                  setCountdown(60);
                  setTimerActive(true);
                  setLoading(false);
                })
                .catch((error) => {
                  setMessage(error?.response?.data?.message);
                  setMessageType("error");
                  setLoading(false);
                });
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => {
              const handleVerificationPress = async () => {
                try {
                  const response = await axios.post('https://project03-rj91.onrender.com/api/users/verify-email', {
                    email: values.email,
                    verificationCode,
                  });

                  setMessage("Verification successful! You can now log in.");
                  setMessageType("success");
                  setIsVerifying(false);
                  router.push('/auth/login');
                } catch (error) {
                  setMessage("Verification failed. Please try again.");
                  setMessageType("error");
                }
              };

              const handleResendCode = async () => {
                try {
                  const response = await axios.post('https://project03-rj91.onrender.com/api/users/request-password-reset', {
                    email: values.email,
                  });

                  setMessage("Verification code resent! Please check your email.");
                  setMessageType("success");
                  setCountdown(60);
                  setTimerActive(true);
                } catch (error) {
                  setMessage("Failed to resend verification code. Please try again.");
                  setMessageType("error");
                }
              };

              return (
                <View style={styles.form}>
                  {!isVerifying ? (
                    <>
                      <TextInput
                        label="First Name"
                        returnKeyType="next"
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        error={!!errors.firstName && touched.firstName}
                        errorText={errors.firstName}
                      />
                      <TextInput
                        label="Last Name"
                        returnKeyType="next"
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        error={!!errors.lastName && touched.lastName}
                        errorText={errors.lastName}
                      />
                      <TextInput
                        label="Email"
                        returnKeyType="next"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        error={!!errors.email && touched.email}
                        errorText={errors.email}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                      />
                      <TextInput
                        label="Password"
                        returnKeyType="next"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        error={!!errors.password && touched.password}
                        errorText={errors.password}
                        secureTextEntry
                      />
                      <TextInput
                        label="Confirm Password"
                        returnKeyType="done"
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        error={!!errors.confirmPassword && touched.confirmPassword}
                        errorText={errors.confirmPassword}
                        secureTextEntry
                      />
                      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 24 }}>
                        Register
                      </Button>
                      
                      <View style={styles.row}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/auth/login")}>
                          <Text style={styles.link}> Login</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.subHeading}>Enter the verification code sent to your email</Text>
                      <TextInput
                        label="Verification Code"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="numeric"
                      />
                      <Text style={styles.countdownText}>
                        {countdown > 0 ? `Time remaining: ${countdown}s` : 'Code expired!'}
                      </Text>
                      <Button mode="contained" onPress={handleVerificationPress} style={{ marginTop: 24 }}>
                        Verify
                      </Button>
                      {countdown <= 0 && (
                        <Button mode="outlined" onPress={handleResendCode} style={{ marginTop: 16 }}>
                          Resend Code
                        </Button>
                      )}
                    </>
                  )}
                </View>
              );
            }}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  successText: {
    color: "green",
    marginBottom: 16,
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
  subHeading: {
    fontSize: 16,
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 14,
    marginBottom: 16,
  },
  
});
