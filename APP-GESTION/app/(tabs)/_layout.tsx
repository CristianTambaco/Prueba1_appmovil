import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="balance" options={{ title: "Balance" }} />
      <Tabs.Screen name="recibos" options={{ title: "Recibos" }} />
      <Tabs.Screen name="reporte" options={{ title: "Reporte" }} />
    </Tabs>
  );
}
