import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { PaginationControls } from "../../components/PaginationControls";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SectionTitle } from "../../components/SectionTitle";
import { ValidationErrors } from "../../components/ValidationErrors";
import { useAuth } from "../../contexts/AuthContext";
import { floodAlertService, FloodAlertResource } from "../../services/floodAlertService";
import { extractValidationErrors, getErrorMessage } from "../../services/http";
import { riverAddressService, RiverAddressResource } from "../../services/riverAddressService";
import { ApiLink, FloodAlert, PaginatedResponse } from "../../types/api";
import { useTheme } from "../../theme";
import { formatDateTime } from "../../utils/format";

const PAGE_SIZE = 5;

const severityOptions = ["Baixo", "Moderado", "Alto", "Crítico"];

type AlertFormState = {
  title: string;
  description: string;
  severity: string;
  personId: string;
  riverAddressId: string;
};

const defaultFormState = (personId?: number): AlertFormState => ({
  title: "",
  description: "",
  severity: "Moderado",
  personId: personId ? String(personId) : "",
  riverAddressId: "",
});

const AlertsScreen = () => {
  const theme = useTheme();
  const { person } = useAuth();
  const [alerts, setAlerts] = useState<PaginatedResponse<FloodAlert> | null>(null);
  const [riverAddresses, setRiverAddresses] = useState<RiverAddressResource[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formState, setFormState] = useState<AlertFormState>(defaultFormState(person?.id));
  const [editing, setEditing] = useState<FloodAlertResource | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  const loadRiverAddresses = useCallback(async () => {
    try {
      const response = await riverAddressService.list(1, 50);
      setRiverAddresses(response.items);
    } catch (error) {
      console.warn("Falha ao carregar pontos de rio", getErrorMessage(error));
    }
  }, []);

  const loadAlerts = useCallback(
    async (link?: ApiLink) => {
      setListLoading(true);
      try {
        const response = link ? await floodAlertService.follow(link) : await floodAlertService.list(1, PAGE_SIZE);
        setAlerts(response);
      } catch (error) {
        Alert.alert("Erro", getErrorMessage(error));
      } finally {
        setListLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAlerts();
    loadRiverAddresses();
  }, [loadAlerts, loadRiverAddresses]);

  useEffect(() => {
    setFormState(defaultFormState(person?.id));
  }, [person]);

  const handleSubmit = async () => {
    if (!formState.title || !formState.description || !formState.severity) {
      Alert.alert("Campos obrigatórios", "Título, descrição e severidade são obrigatórios.");
      return;
    }

    const personId = Number(formState.personId);
    const riverAddressId = Number(formState.riverAddressId);

    if (!personId || !riverAddressId) {
      Alert.alert("Campos obrigatórios", "Informe o ID da pessoa e do ponto de rio.");
      return;
    }

    setFormLoading(true);
    try {
      setValidationErrors(undefined);
      if (editing) {
        await floodAlertService.update(editing, {
          title: formState.title,
          description: formState.description,
          severity: formState.severity,
          personId,
          riverAddressId,
        });
        Alert.alert("Alerta", "Alerta atualizado com sucesso.");
      } else {
        await floodAlertService.create({
          title: formState.title,
          description: formState.description,
          severity: formState.severity,
          personId,
          riverAddressId,
        });
        Alert.alert("Alerta", "Novo alerta cadastrado com sucesso.");
      }

      setFormState(defaultFormState(person?.id));
      setEditing(null);
      await loadAlerts();
    } catch (error) {
      const validation = extractValidationErrors(error);
      setValidationErrors(validation);
      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (resource: FloodAlertResource) => {
    setEditing(resource);
    setValidationErrors(undefined);
    setFormState({
      title: resource.data.title,
      description: resource.data.description,
      severity: resource.data.severity,
      personId: String(resource.data.personId),
      riverAddressId: String(resource.data.riverAddressId),
    });
  };

  const handleDelete = async (resource: FloodAlertResource) => {
    Alert.alert("Excluir alerta", "Deseja realmente remover este alerta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await floodAlertService.remove(resource);
            Alert.alert("Alerta", "Alerta removido com sucesso.");
            await loadAlerts();
          } catch (error) {
            Alert.alert("Erro", getErrorMessage(error));
          }
        },
      },
    ]);
  };

  const riverAddressOptions = useMemo(
    () =>
      riverAddresses.map((item) => ({
        id: item.data.id,
        label: `${item.data.id} • ${item.data.address}`,
      })),
    [riverAddresses]
  );

  return (
    <ScreenContainer>
      <SectionTitle
        title={editing ? "Editar alerta de inundação" : "Novo alerta de inundação"}
        description="Informe os dados do evento para avisar a comunidade."
      />

      <ValidationErrors errors={validationErrors} />

      <FormField
        label="Título"
        value={formState.title}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, title: value }))}
        placeholder="Risco crítico de inundação"
      />
      <FormField
        label="Descrição"
        value={formState.description}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, description: value }))}
        placeholder="Detalhe o volume de chuvas, pontos alagados, etc"
        multiline
        numberOfLines={4}
        style={styles.multiline}
      />
      <FormField
        label="Severidade"
        value={formState.severity}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, severity: value }))}
        placeholder={`Opções: ${severityOptions.join(", ")}`}
      />
      <FormField
        label="ID da pessoa responsável"
        value={formState.personId}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, personId: value }))}
        keyboardType="numeric"
        placeholder="1"
      />
      <FormField
        label="ID do ponto de rio monitorado"
        value={formState.riverAddressId}
        onChangeText={(value) => setFormState((prev) => ({ ...prev, riverAddressId: value }))}
        keyboardType="numeric"
        placeholder="1"
      />

      <PrimaryButton
        title={editing ? "Salvar alterações" : "Cadastrar alerta"}
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
        title="Pontos de rio disponíveis"
        description="Escolha um ID existente ao criar alertas"
      />
      {riverAddressOptions.length === 0 ? (
        <Text style={{ color: theme.colors.muted }}>Nenhum ponto de rio cadastrado até o momento.</Text>
      ) : (
        <View style={{ gap: 12 }}>
          {riverAddressOptions.map((option) => (
            <Card key={option.id}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{option.label}</Text>
            </Card>
          ))}
        </View>
      )}

      <SectionTitle
        title="Alertas registrados"
        description="Consulte o histórico de alertas e gerencie cada item"
      />

      {listLoading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : alerts && alerts.items.length > 0 ? (
        <View style={{ gap: 16 }}>
          {alerts.items.map((item) => (
            <Card key={item.data.id}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.data.title}</Text>
                <Text style={[styles.severity, { color: theme.colors.secondary }]}>{item.data.severity}</Text>
              </View>
              <Text style={[styles.description, { color: theme.colors.muted }]}>{item.data.description}</Text>
              <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
                Criado em: {formatDateTime(item.data.createdAt)}
              </Text>
              <Text style={{ color: theme.colors.muted }}>
                Responsável: Pessoa {item.data.personId} • Ponto do rio {item.data.riverAddressId}
              </Text>
              <View style={styles.cardActions}>
                <PrimaryButton title="Editar" onPress={() => handleEdit(item)} variant="secondary" />
                <PrimaryButton title="Excluir" onPress={() => handleDelete(item)} variant="danger" />
              </View>
            </Card>
          ))}

          <PaginationControls
            page={alerts.pageNumber}
            totalPages={alerts.totalPages}
            links={alerts.links}
            onNavigate={(link) => loadAlerts(link)}
          />
        </View>
      ) : (
        <Text style={{ color: theme.colors.muted }}>Nenhum alerta cadastrado até o momento.</Text>
      )}
    </ScreenContainer>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  multiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  severity: {
    fontWeight: "700",
  },
  description: {
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
});
