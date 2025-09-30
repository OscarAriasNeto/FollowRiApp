import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../theme";

interface ValidationErrorsProps {
  errors?: Record<string, string[]>;
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  const theme = useTheme();

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { borderColor: theme.colors.danger }]}>
      <Text style={[styles.title, { color: theme.colors.danger }]}>Erros de validação:</Text>
      {Object.entries(errors).map(([field, messages]) => (
        <View key={field} style={styles.item}>
          <Text style={[styles.field, { color: theme.colors.text }]}>{field}</Text>
          {messages.map((message, index) => (
            <Text key={index} style={[styles.message, { color: theme.colors.danger }]}>
              • {message}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  item: {
    marginBottom: 6,
  },
  field: {
    fontWeight: "600",
    textTransform: "capitalize",
  },
  message: {
    fontSize: 13,
  },
});
