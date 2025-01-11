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
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (user) {
      router.push("/(tabs)");
    }
  }, [user, router]);

  return (
    <Background>
      <Logo />
      <Header>Login</Header>
      <Formik
        initialValues={{ email: "user@gmail.com", password: "123456" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          mutation
            .mutateAsync(values)
            .then((data) => {
              dispatch(loginAction(data));
              router.push("/(tabs)");
            })
            .catch((err) => {
              console.log(err);
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
            />
            <TextInput
              label="Password"
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
              error={errors.password && touched.password ? errors.password : null}
            />
            <View style={styles.forgotPassword}>
              <TouchableOpacity onPress={() => router.push("/auth/resetPassword")}>
                <Text style={styles.forgot}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>
            <Button mode="contained" onPress={handleSubmit}>
              Login
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
  );
}

const styles = StyleSheet.create({
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
