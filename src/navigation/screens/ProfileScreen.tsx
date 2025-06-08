import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleEmailEdit = () => setShowEmailEdit(!showEmailEdit);
  const togglePasswordEdit = () => setShowPasswordEdit(!showPasswordEdit);

  useEffect(() => {
    // Fetch profile data on mount
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:7181/Person", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setEmail(data.email || "");
        setFullName(data.fullName || "");
        setCpf(data.cpf || "");
        // Password is not fetched for security reasons
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7181/Person", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, cpf, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      setShowEmailEdit(false);
      setShowPasswordEdit(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={100} color="#000" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Endereço de Email</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, !showEmailEdit && styles.disabledInput]}
            placeholder="Coloque seu Endereço de Email"
            placeholderTextColor="#0a0a23"
            value={email}
            onChangeText={setEmail}
            editable={showEmailEdit}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={toggleEmailEdit} style={styles.iconButton}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque seu Nome Completo"
          placeholderTextColor="#0a0a23"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="55569-36"
          placeholderTextColor="#0a0a23"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, !showPasswordEdit && styles.disabledInput]}
            placeholder="************"
            placeholderTextColor="#0a0a23"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPasswordEdit}
            editable={showPasswordEdit}
          />
          <TouchableOpacity onPress={togglePasswordEdit} style={styles.iconButton}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.passwordHint}>
          Pelo menos 8 letras com Maiúsculas e caracteres especiais
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0a6eff",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#0a0a23",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabledInput: {
    color: "#888",
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: "#0a0a23",
    padding: 6,
    borderRadius: 6,
  },
  passwordHint: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#0a6eff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
