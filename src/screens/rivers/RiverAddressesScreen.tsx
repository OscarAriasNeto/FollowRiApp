import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, View } from "react-native";

import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { PaginationControls } from "../../components/PaginationControls";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SectionTitle } from "../../components/SectionTitle";
import { ValidationErrors } from "../../components/ValidationErrors";
import { useAuth } from "../../contexts/AuthContext";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { riverAddressService, RiverAddressResource } from "../../services/riverAddressService";
import { ApiLink, PaginatedResponse, RiverAddress } from "../../types/api";
import { useTheme } from "../../theme";

const PAGE_SIZE = 6;

type RiverFormState = {
  address: string;
  canCauseFlood: boolean;
  personId: string;
};

const defaultFormState = (personId?: number): RiverFormState => ({
  address: "",
  canCauseFlood: false,
  personId: personId ? String(personId) : "",
});

const RiverAddressesScreen = () => {
  const theme = useTheme();
  const { person } = useAuth();
  const [list, setList] = useState<PaginatedResponse<RiverAddress> | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formState, setFormState] = useState<RiverFormState>(defaultFormState(person?.id));
  const [editing, setEditing] = useState<RiverAddressResource | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  const loadAddresses = useCallback(
    async (link?: ApiLink) => {
      setLoading(true);
      try {
        const response = link ? await riverAddressService.follow(link) : await riverAddressService.list(1, PAGE_SIZE);
        setList(response);
      } catch (error) {
        Alert.alert("Erro", getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    setFormState(defaultFormState(person?.id));
  }, [person]);

  const handleSubmit = async () => {
    if (!formState.address) {
      Alert.alert("Campos obrigatórios", "Informe o endereço do ponto de rio.");
      return;
    }

    const personId = Number(formState.personId);
    if (!personId) {
      Alert.alert("Campos obrigatórios", "Informe o ID de uma pessoa responsável.");
      return;
    }

    setFormLoading(true);
    try {
      setValidationErrors(undefined);
      if (editing) {
        await riverAddressService.update(editing, {
          address: formState.address,
          canCauseFlood: formState.canCauseFlood,
          personId,
        });
        Alert.alert("Ponto de rio", "Informações atualizadas com sucesso.");
      } else {
        await riverAddressService.create({
          address: formState.address,
          canCauseFlood: formState.canCauseFlood,
          personId,
        });
        Alert.alert("Ponto de rio", "Novo ponto cadastrado com sucesso.");
      }

      setFormState(defaultFormState(person?.id));
      setEditing(null);
      await loadAddresses();
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (resource: RiverAddressResource) => {
    setEditing(resource);
    setValidationErrors(undefined);
    setFormState({
      address: resource.data.address,
      canCauseFlood: resource.data.canCauseFlood,
      personId: String(resource.data.personId),
    });
  };

  const handleDelete = (resource: RiverAddressResource) => {
    Alert.alert("Remover ponto", "Tem certeza que deseja excluir este ponto de rio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await riverAddressService.remove(resource);
            Alert.alert("Ponto de rio", "Registro removido com sucesso.");
            await loadAddresses();
          } catch (error) {
            Alert.alert("Erro", getErrorMessage(error));
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <SectionTitle
        title={editing ? "Editar ponto de rio" : "Cadastrar ponto de rio"}
        description="Mantenha os endereços monitorados atualizados"
      />

      <ValidationErrors errors={validationErrors} />

      <FormField
        label="Endereço"
        value={formState.address}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, address: value }))}
        placeholder="Margem esquerda do Rio Tietê, km 23"
      />
      <View style={styles.switchRow}>
        <Text style={{ color: theme.colors.text }}>Pode causar inundação?</Text>
        <Switch
          value={formState.canCauseFlood}
          onValueChange={(value) => setFormState((prev) => ({ ...prev, canCauseFlood: value }))}
          thumbColor={formState.canCauseFlood ? theme.colors.primary : theme.colors.muted}
          trackColor={{ true: theme.colors.primaryVariant, false: theme.colors.border }}
        />
      </View>
      <FormField
        label="ID da pessoa responsável"
        value={formState.personId}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, personId: value }))}
        keyboardType="numeric"
        placeholder="1"
      />

      <PrimaryButton
        title={editing ? "Salvar alterações" : "Cadastrar ponto"}
        onPress={handleSubmit}
        loading={formLoading}
      />
      {editing ? (
        <PrimaryButton
          title="Cancelar edição"
          onPress={() => {
            setEditing(null);
            setFormState(defaultFormState(person?.id));
            setValidationErrors(undefined);
          }}
          variant="secondary"
        />
      ) : null}

      <SectionTitle
        title="Pontos cadastrados"
        description="Gerencie os locais monitorados pela equipe"
      />

      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : list && list.items.length > 0 ? (
        <View style={{ gap: 16 }}>
          {list.items.map((item) => (
            <Card key={item.data.id}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.data.address}</Text>
              <Text style={{ color: theme.colors.muted }}>
                ID: {item.data.id} • Pessoa responsável: {item.data.personId}
              </Text>
              <Text style={{ color: item.data.canCauseFlood ? theme.colors.danger : theme.colors.muted }}>
                {item.data.canCauseFlood ? "Risco de inundação" : "Sem risco registrado"}
              </Text>
              <View style={styles.cardActions}>
                <PrimaryButton title="Editar" onPress={() => handleEdit(item)} variant="secondary" />
                <PrimaryButton title="Excluir" onPress={() => handleDelete(item)} variant="danger" />
              </View>
            </Card>
          ))}

          <PaginationControls
            page={list.pageNumber}
            totalPages={list.totalPages}
            links={list.links}
            onNavigate={(link) => loadAddresses(link)}
          />
        </View>
      ) : (
        <Text style={{ color: theme.colors.muted }}>Nenhum ponto cadastrado até o momento.</Text>
      )}
    </ScreenContainer>
  );
};

export default RiverAddressesScreen;

const styles = StyleSheet.create({
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
});
