import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function RequestScreen() {
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [report, setReport] = useState("");

  const handleSolicitar = async () => {
    try {
      const response = await fetch("https://localhost:7181/RiverAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, cep, report }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      console.log("Request success:", data);
      alert("Solicitação enviada com sucesso!");
      setAddress("");
      setCep("");
      setReport("");
    } catch (error) {
      console.error("Request error:", error);
      alert("Erro ao enviar solicitação. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Endereço próximo ao lago</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque seu Endereço"
          placeholderTextColor="#0a0a23"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          placeholder="Coloque o CEP do Lago"
          placeholderTextColor="#0a0a23"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Relato</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Coloque seu relato do ocorrido"
          placeholderTextColor="#0a0a23"
          value={report}
          onChangeText={setReport}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleSolicitar}>
          <Text style={styles.buttonText}>Solicitar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a6eff",
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#0a0a23",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#0a6eff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
