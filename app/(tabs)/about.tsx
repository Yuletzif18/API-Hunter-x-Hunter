

import { useCaballero } from '@/components/CaballeroContext';
import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// APIs disponibles para habilidades
const APIS_HABILIDADES = {
  MONGODB: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/habilidades',
  MYSQL: 'https://api-hunter-x-hunter-mysql.up.railway.app/api/habilidades',
};

export default function AboutScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [habilidadesModalVisible, setHabilidadesModalVisible] = useState(false);
  const { caballero: personaje } = useCaballero();
  const [habilidades, setHabilidades] = useState<any[]>([]);

  useEffect(() => {
    // Consulta las habilidades relacionadas con el personaje usando la misma fuente
    if (personaje && personaje.nombre && personaje.fuente) {
      // Determinar la URL según la fuente del personaje
      const API_URL = personaje.fuente === 'MongoDB' 
        ? APIS_HABILIDADES.MONGODB 
        : APIS_HABILIDADES.MYSQL;
      
      fetch(API_URL)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          // Filtrar habilidades que pertenecen a este personaje
          const habilidadesPersonaje = data.filter((h: any) => 
            h.personaje?.toLowerCase() === personaje.nombre.toLowerCase()
          );
          setHabilidades(habilidadesPersonaje);
        })
        .catch(() => setHabilidades([]));
    }
  }, [personaje]);

  if (!personaje) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No hay personaje consultado.</Text>
      <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Ve a la pestaña "Hunter x Hunter" para consultar un personaje</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {(personaje.urlImagen && (personaje.urlImagen.startsWith('http') || personaje.urlImagen.startsWith('/')))
        ? (
          <View style={{
            maxWidth: 320,
            maxHeight: 220,
            width: '100%',
            height: 'auto',
            borderRadius: 18,
            backgroundColor: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            marginBottom: 10,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}>
            <Image
              source={{ uri: personaje.urlImagen }}
              style={{ width: '100%', height: 200, borderRadius: 18, objectFit: 'contain' }}
              resizeMode="contain"
              onError={() => alert('No se pudo cargar la imagen')}
            />
          </View>
        )
        : (
          <View style={{
            minWidth: 220,
            minHeight: 140,
            borderRadius: 18,
            backgroundColor: '#eee',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            marginBottom: 10,
          }}>
            <Text style={{ color: '#aaa' }}>Sin imagen</Text>
          </View>
        )}
      <Text style={{ fontSize: 18, color: '#666', marginTop: 10 }}>Nombre: {personaje.nombre}</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Button title="Ver Detalles" onPress={() => setModalVisible(true)} />
        <Button title="Ver Habilidades" onPress={() => setHabilidadesModalVisible(true)} color="#FF9800" />
      </View>
      
      {/* Modal Detalles del Personaje */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%', width: '90%' }}>
            <ScrollView>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{personaje.nombre}</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Edad: {personaje.edad || 'N/A'}</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Altura: {personaje.altura || 'N/A'} cm</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Peso: {personaje.peso || 'N/A'} kg</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Género: {personaje.genero || 'N/A'}</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Origen: {personaje.origen || 'N/A'}</Text>
              <Text style={{ fontSize: 16, marginVertical: 8 }}>Descripción: {personaje.descripcion || 'N/A'}</Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Habilidad Principal: {personaje.habilidad || 'N/A'}</Text>
            </ScrollView>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal Habilidades del Personaje */}
      <Modal
        visible={habilidadesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHabilidadesModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%', width: '90%' }}>
            <ScrollView>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>Habilidades de {personaje.nombre}</Text>
              <Text style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>Base de datos: {personaje.fuente || 'N/A'}</Text>
              
              {habilidades.length === 0 ? (
                <Text style={{ color: '#999', textAlign: 'center', marginVertical: 20 }}>
                  No hay habilidades registradas para este personaje
                </Text>
              ) : (
                habilidades.map((h, i) => (
                  <View key={i} style={{ 
                    marginBottom: 16, 
                    padding: 12, 
                    backgroundColor: '#f6f6f6', 
                    borderRadius: 8,
                    borderLeftWidth: 4,
                    borderLeftColor: '#2196F3'
                  }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>{h.nombre}</Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Tipo: {h.tipo || 'N/A'}</Text>
                    <Text style={{ fontSize: 14, marginTop: 4 }}>Descripción: {h.descripcion || 'N/A'}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <Button title="Cerrar" onPress={() => setHabilidadesModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
