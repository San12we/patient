import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import CustomBox from "react-native-customized-box";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { showNotification } = useNotification();

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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: "white" }}>
          <StatusBar barStyle="light-content" />
          <ScrollView style={{ paddingTop: 20 }}>
            <View style={styles.container}>
              <Image
                style={styles.registerImage}
                source={{
                  uri: "https://res.cloudinary.com/dws2bgxg4/image/upload/v1732035035/medplus/e4nxgjnackg7deiqetgp.jpg",
                }}
              />
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
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          boxStyle={{ borderRadius: 40, borderWidth: 2 }}
                          inputStyle={{
                            fontWeight: "bold",
                            color: "#30302e",
                            paddingLeft: 20,
                            borderRadius: 40,
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
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          boxStyle={{ borderRadius: 40, borderWidth: 2 }}
                          inputStyle={{
                            fontWeight: "bold",
                            color: "#30302e",
                            paddingLeft: 20,
                            borderRadius: 40,
                          }}
                          labelConfig={{
                            text: "Last Name",
                            style: {
                              color: "#0e0e21",
                              fontWeight: "bold",
                            },
                          }}
                          requiredConfig={{
                            text: <Text>{touched.lastName && errors.lastName ? errors.lastName : ""}</Text>,
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
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          type={"email"}
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
                            text: <Text>{touched.email && errors.email ? errors.email : ""}</Text>,
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
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          boxStyle={{ borderRadius: 40, borderWidth: 2 }}
                          inputStyle={{
                            fontWeight: "bold",
                            color: "#30302e",
                            paddingLeft: 20,
                            borderRadius: 40,
                            overflow: "hidden",
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
                            text: <Text>{touched.password && errors.password ? errors.password : ""}</Text>,
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
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          boxStyle={{ borderRadius: 40, borderWidth: 2 }}
                          inputStyle={{
                            fontWeight: "bold",
                            color: "#30302e",
                            paddingLeft: 20,
                            borderRadius: 40,
                            overflow: "hidden",
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
                          {loading && loading ? (
                            <ActivityIndicator style={styles.indicator} color={"white"} />
                          ) : null}
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <CustomBox
                          placeholder={"Verification Code"}
                          boxColor={"silver"}
                          focusColor={"#e07964"}
                          boxStyle={{ borderRadius: 40, borderWidth: 2 }}
                          inputStyle={{
                            fontWeight: "bold",
                            color: "#30302e",
                            paddingLeft: 20,
                            borderRadius: 40,
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
          </ScrollView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: '100%',
    padding: 20,
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
  registerImage: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  myLogo: {
    width: 100,
    height: 70,
    borderRadius: 40,
    left: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 25,
  },
  registerbtn: {
    marginTop: 10,
    backgroundColor: Colors.SECONDARY,
    width: 300,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    flexDirection: "row",
  },
  registerBtnText: {
    color: "white",
    fontSize: 22,
  },
  indicator: {
    marginLeft: 10,
  },
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#6200EE",
    marginLeft: 5,
  },
});