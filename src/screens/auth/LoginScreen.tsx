import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ValidationErrors } from "../../components/ValidationErrors";
import { useAuth } from "../../contexts/AuthContext";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { useTheme } from "../../theme";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, loading } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  const handleSubmit = async () => {
    if (!email || !senha) {
      Alert.alert("Campos obrigatórios", "Informe email e senha para continuar.");
      return;
    }

    try {
      setValidationErrors(undefined);
      await login(email, senha);
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Não foi possível entrar", getErrorMessage(error));
    }
  };

  return (
    <ScreenContainer
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Ionicons name="water" size={52} color={theme.colors.secondary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Follow Rivers</Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Monitoramento inteligente de enchentes</Text>
      </View>

      <ValidationErrors errors={validationErrors} />

      <FormField
        label="Endereço de email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="mariana.costa@email.com"
      />
      <View>
        <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing(0.5) }]}>Senha</Text>
        <View
          style={[
            styles.passwordContainer,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <FormField
            label=""
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!passwordVisible}
            placeholder="Senha@2024"
            style={styles.passwordInput}
            containerStyle={styles.passwordFieldContainer}
          />
          <TouchableOpacity onPress={() => setPasswordVisible((prev) => !prev)} style={styles.eyeButton}>
            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
        <Text style={[styles.link, { color: theme.colors.secondary }]}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <PrimaryButton title="Entrar" onPress={handleSubmit} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
        <Text style={[styles.link, { color: theme.colors.text }]}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordFieldContainer: {
    flex: 1,
    marginBottom: 0,
  },
  passwordInput: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  link: {
    textAlign: "center",
    marginTop: 12,
  },
});
