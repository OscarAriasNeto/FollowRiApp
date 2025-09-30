import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Navigation } from "./navigation";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./theme";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <Navigation
            linking={{
              enabled: "auto",
              prefixes: ["followrivers://"],
            }}
            onReady={() => {
              SplashScreen.hideAsync();
            }}
          />
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
