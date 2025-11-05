

import { AuthProvider, useAuth } from '@/components/AuthContext';
import { ImagenProvider } from '@/components/ImagenContext';
import { PersonajeProvider } from '@/components/PersonajeContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Usuario no autenticado intentando acceder a tabs, redirigir a login
      router.replace('/login' as any);
    } else if (isAuthenticated && !inAuthGroup) {
      // Usuario autenticado en login, redirigir a tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PersonajeProvider>
          <ImagenProvider>
            <RootLayoutNav />
          </ImagenProvider>
        </PersonajeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
