import { useAuth } from '@/components/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';


export default function TabLayout() {
  const { usuario, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmar = Platform.OS === 'web' 
      ? window.confirm('¿Seguro que quieres cerrar sesión?')
      : true;

    if (confirmar) {
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Cerrar Sesión',
          '¿Seguro que quieres cerrar sesión?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Cerrar Sesión',
              style: 'destructive',
              onPress: async () => {
                await logout();
                router.replace('/login' as any);
              }
            }
          ]
        );
      } else {
        await logout();
        router.replace('/login' as any);
      }
    }
  };

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#ffd33d',
    headerStyle: {
      backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
      backgroundColor: '#25292e',
    },
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
        <View style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>
            {usuario?.username}
          </Text>
          <Text style={{ 
            color: isAdmin ? '#4CAF50' : '#FFC107', 
            fontSize: 10, 
            fontWeight: 'bold',
            textAlign: 'right'
          }}>
            {isAdmin ? '👑 Admin' : '👤 Usuario'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
            Salir
          </Text>
        </TouchableOpacity>
      </View>
    ),
  }}
>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hunter x Hunter',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }}
      />

      {/* Ruta 'contexto' eliminada para evitar warning de rutas extraneous */}


    </Tabs>
  );
}
