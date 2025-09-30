import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";

import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SectionTitle } from "../../components/SectionTitle";
import { ValidationErrors } from "../../components/ValidationErrors";
import { useAuth } from "../../contexts/AuthContext";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { useTheme } from "../../theme";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { person, updateProfile, logout, loading } = useAuth();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  useEffect(() => {
    if (person) {
      setName(person.name);
      setEmail(person.email);
      setSenha(person.senha ?? "");
    }
  }, [person]);

  useEffect(() => {
    if (!person) {
      navigation.reset({ index: 0, routes: [{ name: "Login" as never }] });
    }
  }, [person, navigation]);

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Perfil", "Nome e email são obrigatórios.");
      return;
    }

    try {
      setValidationErrors(undefined);
      await updateProfile({ name, email, senha });
      Alert.alert("Perfil", "Informações atualizadas com sucesso!");
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Erro", getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenContainer>
      <SectionTitle title="Perfil" description="Atualize seus dados de acesso ao Follow Rivers" />

      <Card>
        <Text style={[styles.label, { color: theme.colors.muted }]}>ID do usuário</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{person?.id ?? "--"}</Text>
      </Card>

      <ValidationErrors errors={validationErrors} />

      <FormField label="Nome completo" value={name} onChangeText={setName} placeholder="Seu nome" />
      <FormField
        label="Endereço de email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="usuario@email.com"
      />
      <FormField
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="Senha complexa"
      />

      <PrimaryButton title="Salvar alterações" onPress={handleSave} loading={loading} />
      <PrimaryButton title="Sair do aplicativo" onPress={handleLogout} variant="danger" />
    </ScreenContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
});
