import { useCaballero } from '@/components/CaballeroContext';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// APIs disponibles - MongoDB y MySQL
const APIS = [
  {
    nombre: 'MongoDB Personajes',
    url: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes',
    tipo: 'personajes'
  },
  {
    nombre: 'MySQL Personajes',
    url: 'https://api-hunter-x-hunter-production.up.railway.app/api/personajes',
    tipo: 'personajes'
  },
  {
    nombre: 'MongoDB Habilidades',
    url: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/habilidades',
    tipo: 'habilidades'
  },
  {
    nombre: 'MySQL Habilidades',
    url: 'https://api-hunter-x-hunter-mysql.up.railway.app/api/habilidades',
    tipo: 'habilidades'
  }
];

const HunterXHunterScreen: React.FC = () => {
  const { setCaballero } = useCaballero();
  const [personajesData, setPersonajesData] = useState<any[]>([]);
  const [habilidadesData, setHabilidadesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar datos de todas las APIs al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);
  
  const cargarDatos = async () => {
    setLoading(true);
    const personajes: any[] = [];
    const habilidades: any[] = [];
    
    // Cargar todas las APIs en paralelo
    await Promise.all(
      APIS.map(async (api) => {
        try {
          const res = await fetch(api.url);
          if (res.ok) {
            const data = await res.json();
            if (api.tipo === 'personajes') {
              data.forEach((item: any) => {
                personajes.push({ ...item, fuente: api.nombre });
              });
            } else {
              data.forEach((item: any) => {
                habilidades.push({ ...item, fuente: api.nombre });
              });
            }
          }
        } catch (error) {
          console.error(`Error al cargar ${api.nombre}:`, error);
        }
      })
    );
    
    setPersonajesData(personajes);
    setHabilidadesData(habilidades);
    setLoading(false);
  };
  
  const seleccionarPersonaje = (personaje: any) => {
    setCaballero(personaje);
    Alert.alert(
      'Personaje Seleccionado',
      `${personaje.nombre}\n\nVe a la pestaña "About" para ver todos los detalles y habilidades relacionadas.`,
      [{ text: 'OK' }]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando datos de todas las APIs...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Hunter x Hunter - Personajes</Text>
      <Text style={styles.subtitle}>Toca un personaje para ver sus detalles completos en la pestaña About</Text>
      
      {/* Lista de Personajes */}
      <View style={styles.section}>
        {personajesData.length === 0 ? (
          <Text style={styles.emptyText}>No hay personajes disponibles</Text>
        ) : (
          personajesData.map((personaje, index) => (
            <TouchableOpacity
              key={`${personaje.nombre}-${index}`}
              style={styles.card}
              onPress={() => seleccionarPersonaje(personaje)}
            >
              {personaje.urlImagen ? (
                <Image 
                  source={{ uri: personaje.urlImagen }} 
                  style={styles.cardImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <Text style={styles.noImageText}>Sin imagen</Text>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{personaje.nombre}</Text>
                <Text style={styles.cardSource}>📊 {personaje.fuente}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      
      {/* Separador */}
      <View style={styles.divider} />
      
      {/* Lista de Habilidades */}
      <Text style={styles.mainTitle}>Habilidades</Text>
      <Text style={styles.subtitle}>Todas las habilidades disponibles en las bases de datos</Text>
      
      <View style={styles.section}>
        {habilidadesData.length === 0 ? (
          <Text style={styles.emptyText}>No hay habilidades disponibles</Text>
        ) : (
          habilidadesData.map((habilidad, index) => (
            <View
              key={`${habilidad.nombre}-${index}`}
              style={styles.habilidadCard}
            >
              <Text style={styles.habilidadNombre}>{habilidad.nombre}</Text>
              <Text style={styles.habilidadTipo}>Tipo: {habilidad.tipo || 'N/A'}</Text>
              <Text style={styles.habilidadPersonaje}>Personaje: {habilidad.personaje || 'N/A'}</Text>
              <Text style={styles.cardSource}>📊 {habilidad.fuente}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 16,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSource: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 4,
  },
  habilidadCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  habilidadNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  habilidadTipo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  habilidadPersonaje: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginVertical: 20,
  },
});

export default HunterXHunterScreen;
