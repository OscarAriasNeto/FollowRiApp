import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Splash from "./screens/Splash";
import { NotFound } from "./screens/NotFound";
import ForgotPassword from "./screens/ForgotPassword";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Splash,
      options: {
        title: "Splash",
        headerShown: false,
      },
    },

    Login: {
      screen: Login,
      options: ({ navigation }) => ({
        title: "Login",
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
      }),
    },

    Register: {
      screen: Register,
      options: ({ navigation }) => ({
        title: "Cadastre-se",
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
      }),
    },

    ForgotPassword: {
      screen: ForgotPassword,
      options: ({ navigation }) => ({
        title: "Esqueceu a senha",
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
      }),
    },

    NotFound: {
      screen: NotFound,
      options: ({ navigation }) => ({
        title: "404",
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
      }),
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
