import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ValidationErrors } from "../../components/ValidationErrors";
import { useAuth } from "../../contexts/AuthContext";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { useTheme } from "../../theme";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register, loading } = useAuth();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  const handleSubmit = async () => {
    if (!termsAccepted) {
      Alert.alert("Termos de uso", "Você precisa aceitar os termos para continuar.");
      return;
    }

    if (!name || !email || !senha) {
      Alert.alert("Campos obrigatórios", "Informe nome, email e senha.");
      return;
    }

    if (senha !== confirmPassword) {
      Alert.alert("Senha", "As senhas informadas não coincidem.");
      return;
    }

    try {
      setValidationErrors(undefined);
      await register({ name, email, senha });
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Não foi possível cadastrar", getErrorMessage(error));
    }
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: theme.colors.text }]}>Criar conta</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Cadastre-se para acompanhar alertas de inundação em tempo real.</Text>

      <ValidationErrors errors={validationErrors} />

      <FormField
        label="Nome completo"
        value={name}
        onChangeText={setName}
        placeholder="Mariana Costa"
      />
      <FormField
        label="Endereço de email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="mariana.costa@email.com"
      />
      <FormField
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="Senha@2024"
      />
      <FormField
        label="Confirmar senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Repita sua senha"
      />

      <TouchableOpacity
        onPress={() => setTermsAccepted((prev) => !prev)}
        style={[styles.termsContainer, { borderColor: theme.colors.border }]}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: termsAccepted ? theme.colors.primary : "transparent",
              borderColor: theme.colors.border,
            },
          ]}
        />
        <Text style={[styles.termsText, { color: theme.colors.text }]}>Aceito os termos de uso e privacidade</Text>
      </TouchableOpacity>

      <PrimaryButton title="Cadastrar" onPress={handleSubmit} loading={loading} disabled={!termsAccepted} />

      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={[styles.link, { color: theme.colors.text }]}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
  },
  termsText: {
    flex: 1,
  },
  link: {
    textAlign: "center",
    marginTop: 16,
  },
});
