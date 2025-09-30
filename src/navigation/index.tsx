import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation, StaticParamList } from "@react-navigation/native";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import SplashScreen from "../screens/SplashScreen";
import AlertsScreen from "../screens/alerts/AlertsScreen";
import RiverAddressesScreen from "../screens/rivers/RiverAddressesScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import theme from "../theme";

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.textOnPrimary,
        tabBarInactiveTintColor: theme.colors.textOnPrimary,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          borderTopColor: theme.colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string = "ellipse-outline";

          if (route.name === "Alerts") {
            iconName = "warning-outline";
          } else if (route.name === "Rivers") {
            iconName = "water-outline";
          } else if (route.name === "Profile") {
            iconName = "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ title: "Alertas" }}
      />
      <Tab.Screen
        name="Rivers"
        component={RiverAddressesScreen}
        options={{ title: "Pontos de rio" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Splash: {
      screen: SplashScreen,
      options: {
        headerShown: false,
      },
    },
    Login: {
      screen: LoginScreen,
      options: {
        title: "Entrar",
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      },
    },
    Register: {
      screen: RegisterScreen,
      options: {
        title: "Criar conta",
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      },
    },
    ForgotPassword: {
      screen: ForgotPasswordScreen,
      options: {
        title: "Recuperar senha",
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      },
    },
    MainTabs: {
      screen: MainTabs,
      options: {
        headerShown: false,
      },
    },
    NotFound: {
      screen: NotFoundScreen,
      options: {
        title: "404",
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
      },
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
