import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { useTheme } from "../theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  containerStyle?: object;
}

export const FormField = ({ label, error, style, containerStyle, ...rest }: FormFieldProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { marginBottom: theme.spacing(1.5) }, containerStyle]}>
      <Text style={[styles.label, { color: theme.colors.text, marginBottom: theme.spacing(0.5) }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: error ? theme.colors.danger : theme.colors.border,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.muted}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
