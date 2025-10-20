import React from "react";
import { Stack, Tabs } from "expo-router";
import { ExpensesProvider } from "../context/ExpensesContext";

export default function Layout() {
  return (
    <ExpensesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ExpensesProvider>
  );
}

// archivo adicional: app/(tabs).tsx para tabs
