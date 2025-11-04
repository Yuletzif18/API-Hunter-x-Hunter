

import { PersonajeProvider } from '@/components/PersonajeContext';
import { ImagenProvider } from '@/components/ImagenContext';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersonajeProvider>
        <ImagenProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ImagenProvider>
      </PersonajeProvider>
    </GestureHandlerRootView>
  );
}
