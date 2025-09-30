import React, { createContext, ReactNode, useContext } from "react";

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    text: string;
    textOnPrimary: string;
    muted: string;
    danger: string;
    success: string;
    border: string;
  };
  spacing: (factor?: number) => number;
  typography: {
    heading: number;
    subheading: number;
    body: number;
    small: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
}

const theme: Theme = {
  colors: {
    background: "#0a2647",
    surface: "#133b5c",
    primary: "#1b98e0",
    primaryVariant: "#247ba0",
    secondary: "#f6ae2d",
    text: "#f9f7f7",
    textOnPrimary: "#ffffff",
    muted: "#c9d6df",
    danger: "#ef476f",
    success: "#06d6a0",
    border: "#1f3c88",
  },
  spacing: (factor = 1) => factor * 8,
  typography: {
    heading: 24,
    subheading: 18,
    body: 16,
    small: 12,
  },
  radii: {
    sm: 6,
    md: 12,
    lg: 20,
  },
};

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

export default theme;
