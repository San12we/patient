


import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { registerUser } from "../(services)/api/api";
import TextInput from "@/components/TextInput";
import Background from "@/components/Background";
import Logo from "@/components/Logo";
import Button from "@/components/Header";

const { width } = Dimensions.get("window");

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
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Logo />
          {loading && <ActivityIndicator size="large" color="#6200EE" />}
          <KeyboardAvoidingView behavior="padding" enabled>
            <Formik
              initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values) => {
                setLoading(true);
                mutation
                  .mutateAsync(values)
                  .then(() => {
                    router.push("/auth/login");
                  })
                  .catch(() => setLoading(false));
              }}
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
                    label="First Name"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    error={touched.firstName && errors.firstName}
                    errorText={touched.firstName && errors.firstName ? errors.firstName : ""}
                    description=""
                  />
                  <TextInput
                    label="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    error={touched.lastName && errors.lastName}
                    errorText={touched.lastName && errors.lastName ? errors.lastName : ""}
                    description=""
                  />
                  <TextInput
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorText={touched.email && errors.email ? errors.email : ""}
                    description=""
                  />
                  <TextInput
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password && errors.password}
                    secureTextEntry
                    errorText={touched.password && errors.password ? errors.password : ""}
                    description=""
                  />
                  <TextInput
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    error={touched.confirmPassword && errors.confirmPassword}
                    secureTextEntry
                    errorText={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
                    description=""
                  />
                  <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Register
                  </Button>
                  <View style={styles.footer}>
                    <Text>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/auth/login")}>
                      <Text style={styles.link}> Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    marginTop: 20,
    width: "100%",
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
