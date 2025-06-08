import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Endereço de Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque seu endereço de email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque seu Nome Completo"
          placeholderTextColor="#ccc"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque seu CPF"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Coloque sua Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            style={styles.checkbox}
          >
            {termsAccepted && <View style={styles.checkboxChecked} />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Aceito termos de uso e Privacidade
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, !termsAccepted && styles.buttonDisabled]}
          disabled={!termsAccepted}
          onPress={async () => {
            if (!termsAccepted) {
              alert("Você deve aceitar os termos para continuar.");
              return;
            }
            try {
              const response = await fetch("https://localhost:7181/Person", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, fullName, cpf, password }),
              });
              if (!response.ok) {
                throw new Error("Register failed");
              }
              const data = await response.json();
              console.log("Register success:", data);
              alert("Cadastro realizado com sucesso! Faça login.");
              // Navigate to login screen after successful register
              navigation.navigate("Login");
            } catch (error) {
              console.error("Register error:", error);
              alert("Erro ao cadastrar. Tente novamente.");
            }
          }}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0033cc",
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#0055ff",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: "#fff",
  },
  termsText: {
    color: "#a0a0a0",
  },
  button: {
    backgroundColor: "#0055ff",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#003399",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  loginText: {
    color: "#a0a0a0",
    textAlign: "center",
    fontSize: 14,
  },
});
