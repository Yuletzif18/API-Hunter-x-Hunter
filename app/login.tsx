import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Por favor ingresa usuario y contraseña');
      } else {
        Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      }
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      if (Platform.OS === 'web') {
        window.alert('¡Bienvenido! Has iniciado sesión correctamente');
      } else {
        Alert.alert('Éxito', '¡Bienvenido! Has iniciado sesión correctamente');
      }
      router.replace('/(tabs)');
    } else {
      if (Platform.OS === 'web') {
        window.alert(`Error: ${result.error}`);
      } else {
        Alert.alert('Error', result.error || 'Credenciales inválidas');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎯 Hunter x Hunter</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>👤 Credenciales de prueba:</Text>
          <Text style={styles.infoText}>Admin: admin / admin123</Text>
          <Text style={styles.infoText}>Usuario: usuario1 / user123</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.roleInfo}>
          <Text style={styles.roleTitle}>📋 Roles:</Text>
          <Text style={styles.roleText}>• <Text style={styles.roleBold}>Admin:</Text> CRUD completo</Text>
          <Text style={styles.roleText}>• <Text style={styles.roleBold}>Usuario:</Text> Solo lectura</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#7f8c8d',
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#27ae60',
  },
  infoText: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  roleInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#856404',
  },
  roleText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 2,
  },
  roleBold: {
    fontWeight: 'bold',
  },
});
