// app/_layout.tsx
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GastosProvider } from './context/GastosContext';

export default function RootLayout() {
  return (
    <GastosProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GastosProvider>
  );
}