import React, { ReactNode } from "react";
import { ScrollView, ScrollViewProps, StyleSheet, View } from "react-native";

import { useTheme } from "../theme";

interface ScreenContainerProps extends ScrollViewProps {
  children: ReactNode;
  footer?: ReactNode;
}

export const ScreenContainer = ({ children, footer, contentContainerStyle, ...rest }: ScreenContainerProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing(3) },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { padding: theme.spacing(2) }]}>{footer}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
