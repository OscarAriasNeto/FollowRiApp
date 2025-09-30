import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../theme";

interface SectionTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionTitle = ({ title, description, action }: SectionTitleProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { marginBottom: theme.spacing(1) }]}> 
      <View style={styles.texts}>
        <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.subheading }]}>
          {title}
        </Text>
        {description ? (
          <Text style={[styles.description, { color: theme.colors.muted }]}>{description}</Text>
        ) : null}
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
  },
});
