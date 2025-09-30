import React, { ReactNode } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useTheme } from "../theme";

interface CardProps extends ViewProps {
  children: ReactNode;
}

export const Card = ({ children, style, ...rest }: CardProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
