import React from "react";
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useTheme } from "../theme";

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export const PrimaryButton = ({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
}: PrimaryButtonProps) => {
  const theme = useTheme();
  const backgroundColor =
    variant === "secondary"
      ? theme.colors.secondary
      : variant === "danger"
      ? theme.colors.danger
      : theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          opacity: disabled || loading ? 0.7 : 1,
        },
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.textOnPrimary} />
      ) : (
        <Text style={[styles.text, { color: theme.colors.textOnPrimary }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});
