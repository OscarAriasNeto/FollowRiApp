import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../theme";

const SplashScreen = () => {
  const navigation = useNavigation();
  const { person, initializing } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (person) {
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" as never }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Login" as never }] });
    }
  }, [person, initializing, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.text }]}>Carregando Follow Rivers...</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
