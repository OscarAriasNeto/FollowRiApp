import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ValidationErrors } from "../../components/ValidationErrors";
import { personService } from "../../services/personService";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { useTheme } from "../../theme";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  const handleSubmit = async () => {
    if (!email || !senha) {
      Alert.alert("Campos obrigatórios", "Informe email e nova senha.");
      return;
    }

    setLoading(true);
    try {
      setValidationErrors(undefined);
      const resource = await personService.findByEmail(email);

      if (!resource) {
        Alert.alert("Recuperação", "Nenhum usuário foi encontrado com esse email.");
        return;
      }

      await personService.update(resource, {
        name: resource.data.name,
        email: resource.data.email,
        senha,
      });

      Alert.alert(
        "Senha atualizada",
        "Sua nova senha foi salva com sucesso!",
        [{ text: "Voltar para login", onPress: () => navigation.navigate("Login" as never) }]
      );
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: theme.colors.text }]}>Recuperar senha</Text>
      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>Informe o email cadastrado e defina uma nova senha segura.</Text>

      <ValidationErrors errors={validationErrors} />

      <FormField
        label="Endereço de email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="mariana.costa@email.com"
      />
      <FormField
        label="Nova senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="NovaSenha@2025"
      />

      <PrimaryButton title="Atualizar senha" onPress={handleSubmit} loading={loading} />
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
  },
});
