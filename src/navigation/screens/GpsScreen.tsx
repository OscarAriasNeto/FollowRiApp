import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function GpsScreen() {
  const handleAtivarGps = () => {
    // Handle GPS activation logic here
    console.log("Ativar GPS clicked");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Image
          source={require("../../assets/Rivers.png")}
          style={styles.mapImage}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAtivarGps}>
        <Text style={styles.buttonText}>Ativar GPS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a6eff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapContainer: {
    width: 300,
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#0a6eff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
