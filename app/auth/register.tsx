import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import CustomBox from "react-native-customized-box";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../(services)/api/api";
import { Formik } from "formik";
import * as Yup from "yup";
import Colors from "@/components/Shared/Colors";
import { useNotification } from '../../context/NotificationsContext';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
});

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { showNotification } = useNotification();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  const registerFunction = async (values) => {
    setLoading(true);
    try {
      const response = await mutation.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        userType: "patient", // or any other user type
      });
      console.log("Registration successful:", response);
      setIsVerificationSent(true);
      showNotification({
        title: 'Success',
        message: 'Registration successful!',
        type: 'success'
      });
    } catch (error) {
      console.error("Error registering user:", error);
      showNotification({
        title: 'Error',
        message: (error instanceof Error ? error.message : 'Registration failed'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = () => {
    // Logic to verify the email with the provided verification code
    // This is a placeholder and should be replaced with actual verification logic
    console.log("Verification code entered:", verificationCode);
    router.push("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: "white" }}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.container}>
            <Text style={styles.header}>Create an Account</Text>
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={registerFunction}
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
                  {!isVerificationSent ? (
                    <>
                      <CustomBox
                        placeholder={"First Name"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "First Name",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        requiredConfig={{
                          text: touched.firstName && errors.firstName ? errors.firstName : "",
                          style: {
                            marginBottom: 10,
                          },
                        }}
                        values={values.firstName}
                        onChangeText={handleChange("firstName")}
                      />
                      <CustomBox
                        placeholder={"Last Name"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "Last Name",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        requiredConfig={{
                          text: touched.lastName && errors.lastName ? errors.lastName : "",
                          style: {
                            marginBottom: 10,
                          },
                        }}
                        values={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                      />
                      <CustomBox
                        placeholder={"Email"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        type={"email"}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "Email",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        requiredConfig={{
                          text: touched.email && errors.email ? errors.email : "",
                          style: {
                            marginBottom: 10,
                          },
                        }}
                        values={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                      />
                      <CustomBox
                        placeholder={"Password"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "Password",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        toggle={true}
                        requiredConfig={{
                          text: touched.password && errors.password ? errors.password : "",
                          style: {
                            marginBottom: 10,
                          },
                        }}
                        values={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      <CustomBox
                        placeholder={"Confirm Password"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "Confirm Password",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        toggle={true}
                        requiredConfig={{
                          text: touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : "",
                          style: {
                            marginBottom: 10,
                          },
                        }}
                        values={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                      />
                      <TouchableOpacity
                        style={styles.registerbtn}
                        onPress={() => handleSubmit()}
                      >
                        <Text style={styles.registerBtnText}>Register</Text>
                        {loading && (
                          <ActivityIndicator style={styles.indicator} color={"white"} />
                        )}
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <CustomBox
                        placeholder={"Verification Code"}
                        boxColor={"#f0f0f0"}
                        focusColor={Colors.SECONDARY}
                        boxStyle={{ borderRadius: 10, borderWidth: 1 }}
                        inputStyle={{
                          fontWeight: "500",
                          color: "#30302e",
                          paddingLeft: 15,
                        }}
                        labelConfig={{
                          text: "Verification Code",
                          style: {
                            color: "#0e0e21",
                            fontWeight: "bold",
                          },
                        }}
                        values={verificationCode}
                        onChangeText={setVerificationCode}
                      />
                      <TouchableOpacity
                        style={styles.registerbtn}
                        onPress={verifyEmail}
                      >
                        <Text style={styles.registerBtnText}>Verify Email</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <View style={styles.footer}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/auth/login")}>
                      <Text style={styles.link}> Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.SECONDARY,
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  registerbtn: {
    marginTop: 20,
    backgroundColor: Colors.SECONDARY,
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  registerBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  indicator: {
    marginLeft: 10,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: Colors.SECONDARY,
    fontWeight: "bold",
    marginLeft: 5,
  },
});