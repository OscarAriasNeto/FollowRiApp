import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ApiLink } from "../types/api";
import { useTheme } from "../theme";
import { PrimaryButton } from "./PrimaryButton";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  links: ApiLink[];
  onNavigate: (link: ApiLink) => void;
}

export const PaginationControls = ({ page, totalPages, links, onNavigate }: PaginationControlsProps) => {
  const theme = useTheme();

  const previousLink = links?.find((link) => link.rel.toLowerCase() === "previous");
  const nextLink = links?.find((link) => link.rel.toLowerCase() === "next");

  return (
    <View style={[styles.container, { marginTop: theme.spacing(2) }]}>
      <PrimaryButton
        title="Anterior"
        onPress={() => previousLink && onNavigate(previousLink)}
        disabled={!previousLink}
        variant="secondary"
      />
      <Text style={[styles.pageText, { color: theme.colors.text }]}>
        Página {page} de {totalPages}
      </Text>
      <PrimaryButton
        title="Próxima"
        onPress={() => nextLink && onNavigate(nextLink)}
        disabled={!nextLink}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  pageText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
});
