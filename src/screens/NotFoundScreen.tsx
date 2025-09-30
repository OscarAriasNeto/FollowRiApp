import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme } from "../theme";
import { useNavigation } from "@react-navigation/native";

const NotFoundScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>Página não encontrada</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Não foi possível localizar a rota solicitada.</Text>
      <PrimaryButton title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
  },
});
