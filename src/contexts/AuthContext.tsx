import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { personService, PersonResource } from "../services/personService";
import { CreatePersonPayload, Person, UpdatePersonPayload } from "../types/api";
import { getErrorMessage } from "../services/http";

interface AuthContextValue {
  person: Person | null;
  resource: PersonResource | null;
  loading: boolean;
  initializing: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (payload: CreatePersonPayload) => Promise<void>;
  updateProfile: (payload: UpdatePersonPayload) => Promise<PersonResource>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "@followrivers.auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [resource, setResource] = useState<PersonResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: PersonResource = JSON.parse(raw);
          setResource(parsed);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário salvo", error);
      } finally {
        setInitializing(false);
      }
    };

    loadStoredUser();
  }, []);

  const persist = async (value: PersonResource | null) => {
    if (!value) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  const handleLogin = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const authenticated = await personService.authenticate(email, senha);
      setResource(authenticated);
      await persist(authenticated);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload: CreatePersonPayload) => {
    setLoading(true);
    try {
      const created = await personService.create(payload);
      setResource(created);
      await persist(created);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (payload: UpdatePersonPayload) => {
    if (!resource) {
      throw new Error("Nenhum usuário autenticado");
    }

    setLoading(true);
    try {
      const updated = await personService.update(resource, payload);
      setResource(updated);
      await persist(updated);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setResource(null);
    await persist(null);
  };

  const handleRefresh = async () => {
    if (!resource) {
      return;
    }

    try {
      const fresh = await personService.get(resource.data.id);
      setResource(fresh);
      await persist(fresh);
    } catch (error) {
      console.warn("Não foi possível atualizar os dados do usuário:", getErrorMessage(error));
    }
  };

  const value = useMemo(
    () => ({
      person: resource?.data ?? null,
      resource,
      loading,
      initializing,
      login: handleLogin,
      register: handleRegister,
      updateProfile: handleUpdate,
      logout: handleLogout,
      refresh: handleRefresh,
    }),
    [resource, loading, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider");
  }
  return context;
};
