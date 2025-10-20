// app/modal/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen name="NuevoGasto" options={{ headerShown: false }} />
      <Stack.Screen name="GastoDetalle" options={{ headerShown: false }} />
      <Stack.Screen name="ReciboDetalle" options={{ headerShown: false }} />
    </Stack>
  );
}