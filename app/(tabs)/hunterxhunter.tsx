import React, { useState } from 'react';
import { Alert, Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCaballero } from '@/components/CaballeroContext';

// APIs disponibles
const APIS = {
  MONGODB: {
    personajes: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes',
    habilidades: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/habilidades',
  },
  MYSQL: {
    personajes: 'https://api-hunter-x-hunter-production.up.railway.app/api/personajes',
    habilidades: 'https://api-hunter-x-hunter-mysql.up.railway.app/api/habilidades',
  }
};

const HunterXHunterScreen: React.FC = () => {
  // Selector de API: MongoDB o MySQL
  const [apiType, setApiType] = useState<'MONGODB' | 'MYSQL'>('MONGODB');
  const { setCaballero } = useCaballero();
  
  // Estados para el CRUD
  const [nombre, setNombre] = useState('');
  const [item, setItem] = useState<any>(null);
  const [lista, setLista] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [itemEdit, setItemEdit] = useState<any>(null);
  
  // Estados del formulario (personajes)
  const [formPersonaje, setFormPersonaje] = useState({
    nombre: '', edad: '', altura: '', peso: '', urlImagen: '', genero: '', descripcion: '', habilidad: '', origen: ''
  });
  
  const API_URL = APIS[apiType].personajes;
  
  // Consultar item por nombre
  const consultarItem = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Aviso', 'Ingresa el nombre del personaje');
        return;
      }
      
      const res = await fetch(API_URL);
      if (res.ok) {
        const items = await res.json();
        const found = items.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
        if (found) {
          setItem(found);
          setCaballero(found); // Guardar en Context
          Alert.alert('Encontrado', `Personaje encontrado: ${found.nombre}\n\nVe a la pestaña "About" para ver todos los detalles y habilidades.`);
        } else {
          setItem(null);
          Alert.alert('No encontrado', 'No existe en la base de datos');
        }
      } else {
        setItem(null);
        Alert.alert('Error', 'No se pudo consultar');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
    }
  };
  
  // Insertar nuevo item
  const insertarItem = async () => {
    try {
      const body = formPersonaje;
      
      // Validación
      if (!body.nombre.trim()) {
        Alert.alert('Error', 'El nombre es obligatorio');
        return;
      }
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        Alert.alert('Éxito', 'Personaje insertado correctamente');
        setModalVisible(false);
        // Limpiar formulario
        setFormPersonaje({ nombre: '', edad: '', altura: '', peso: '', urlImagen: '', genero: '', descripcion: '', habilidad: '', origen: '' });
      } else {
        const errorData = await res.json();
        Alert.alert('Error', errorData.error || 'No se pudo insertar');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
    }
  };
  
  // Eliminar item
  const eliminarItem = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Aviso', 'Ingresa el nombre del personaje a eliminar');
        return;
      }
      
      // Primero buscar el ID
      const res = await fetch(API_URL);
      if (res.ok) {
        const items = await res.json();
        const found = items.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
        
        if (found) {
          const deleteRes = await fetch(`${API_URL}/${found._id}`, {
            method: 'DELETE',
          });
          
          if (deleteRes.ok) {
            Alert.alert('Eliminado', 'Personaje eliminado correctamente');
            setItem(null);
            setNombre('');
          } else {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        } else {
          Alert.alert('No encontrado', 'No existe en la base de datos');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
    }
  };
  
  // Listar todos los items
  const listarItems = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const items = await res.json();
        setLista(items);
        setItemEdit(null);
        setEditModalVisible(true);
      } else {
        Alert.alert('Error', 'No se pudo obtener la lista');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
    }
  };
  
  // Actualizar item
  const actualizarItem = async () => {
    try {
      if (!itemEdit || !itemEdit._id) {
        Alert.alert('Error', 'No hay item seleccionado para actualizar');
        return;
      }
      
      const res = await fetch(`${API_URL}/${itemEdit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemEdit)
      });
      
      if (res.ok) {
        Alert.alert('Actualizado', 'Personaje actualizado correctamente');
        // Refrescar lista
        listarItems();
      } else {
        const errorData = await res.json();
        Alert.alert('Error', errorData.error || 'No se pudo actualizar');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar al servidor');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Selector de API */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Seleccionar Base de Datos:</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.selectorButton, apiType === 'MONGODB' && styles.selectorButtonActive]}
            onPress={() => setApiType('MONGODB')}
          >
            <Text style={[styles.selectorButtonText, apiType === 'MONGODB' && styles.selectorButtonTextActive]}>MongoDB</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.selectorButton, apiType === 'MYSQL' && styles.selectorButtonActive]}
            onPress={() => setApiType('MYSQL')}
          >
            <Text style={[styles.selectorButtonText, apiType === 'MYSQL' && styles.selectorButtonTextActive]}>MySQL</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.apiInfo}>
          API Actual: {apiType} - {API_URL}
        </Text>
      </View>
      
      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Nombre del personaje"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <Button title="Consultar" onPress={consultarItem} color="#2196F3" />
      </View>
      
      {/* Botones CRUD */}
      <View style={styles.crudButtons}>
        <View style={styles.buttonWrapper}>
          <Button title="Insertar" onPress={() => setModalVisible(true)} color="#4CAF50" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Eliminar" onPress={eliminarItem} color="#f44336" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Listar/Modificar" onPress={listarItems} color="#FF9800" />
        </View>
      </View>
      
      {/* Mostrar Personaje Consultado - SOLO NOMBRE E IMAGEN */}
      {item && (
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Personaje Encontrado:</Text>
          {item.urlImagen && (
            <Image source={{ uri: item.urlImagen }} style={styles.image} resizeMode="contain" />
          )}
          <Text style={styles.itemText}><Text style={styles.bold}>Nombre:</Text> {item.nombre}</Text>
          <Text style={styles.infoText}>📌 Ve a la pestaña "About" para ver detalles completos y habilidades</Text>
        </View>
      )}
      
      {/* Modal Insertar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Insertar Personaje</Text>
              
              <TextInput placeholder="Nombre *" value={formPersonaje.nombre} onChangeText={v => setFormPersonaje(f => ({ ...f, nombre: v }))} style={styles.input} />
              <TextInput placeholder="Edad" value={formPersonaje.edad} onChangeText={v => setFormPersonaje(f => ({ ...f, edad: v }))} style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Altura (cm)" value={formPersonaje.altura} onChangeText={v => setFormPersonaje(f => ({ ...f, altura: v }))} style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Peso (kg)" value={formPersonaje.peso} onChangeText={v => setFormPersonaje(f => ({ ...f, peso: v }))} style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="URL Imagen *" value={formPersonaje.urlImagen} onChangeText={v => setFormPersonaje(f => ({ ...f, urlImagen: v }))} style={styles.input} />
              <TextInput placeholder="Género" value={formPersonaje.genero} onChangeText={v => setFormPersonaje(f => ({ ...f, genero: v }))} style={styles.input} />
              <TextInput placeholder="Descripción" value={formPersonaje.descripcion} onChangeText={v => setFormPersonaje(f => ({ ...f, descripcion: v }))} style={styles.input} multiline />
              <TextInput placeholder="Habilidad" value={formPersonaje.habilidad} onChangeText={v => setFormPersonaje(f => ({ ...f, habilidad: v }))} style={styles.input} />
              <TextInput placeholder="Origen" value={formPersonaje.origen} onChangeText={v => setFormPersonaje(f => ({ ...f, origen: v }))} style={styles.input} />
              
              <View style={styles.modalButtons}>
                <Button title="Insertar" onPress={insertarItem} color="#4CAF50" />
                <View style={{ height: 10 }} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#f44336" />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Modal Listar/Modificar */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Lista de Personajes</Text>
              
              {!itemEdit ? (
                <View>
                  {lista.length === 0 ? (
                    <Text style={styles.emptyText}>No hay datos disponibles</Text>
                  ) : (
                    lista.map((i) => (
                      <TouchableOpacity 
                        key={i._id} 
                        style={styles.listItem} 
                        onPress={() => setItemEdit(i)}
                      >
                        <Text style={styles.listItemText}>{i.nombre}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                  <View style={{ marginTop: 20 }}>
                    <Button title="Cerrar" onPress={() => setEditModalVisible(false)} color="#f44336" />
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.subtitle}>Editando: {itemEdit.nombre}</Text>
                  
                  <TextInput placeholder="Nombre" value={itemEdit.nombre || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, nombre: v }))} style={styles.input} />
                  <TextInput placeholder="Edad" value={String(itemEdit.edad || '')} onChangeText={v => setItemEdit((e: any) => ({ ...e, edad: v }))} style={styles.input} keyboardType="numeric" />
                  <TextInput placeholder="Altura" value={String(itemEdit.altura || '')} onChangeText={v => setItemEdit((e: any) => ({ ...e, altura: v }))} style={styles.input} keyboardType="numeric" />
                  <TextInput placeholder="Peso" value={String(itemEdit.peso || '')} onChangeText={v => setItemEdit((e: any) => ({ ...e, peso: v }))} style={styles.input} keyboardType="numeric" />
                  <TextInput placeholder="URL Imagen" value={itemEdit.urlImagen || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, urlImagen: v }))} style={styles.input} />
                  <TextInput placeholder="Género" value={itemEdit.genero || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, genero: v }))} style={styles.input} />
                  <TextInput placeholder="Descripción" value={itemEdit.descripcion || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, descripcion: v }))} style={styles.input} multiline />
                  <TextInput placeholder="Habilidad" value={itemEdit.habilidad || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, habilidad: v }))} style={styles.input} />
                  <TextInput placeholder="Origen" value={itemEdit.origen || ''} onChangeText={v => setItemEdit((e: any) => ({ ...e, origen: v }))} style={styles.input} />
                  
                  <View style={styles.modalButtons}>
                    <Button title="Actualizar" onPress={actualizarItem} color="#4CAF50" />
                    <View style={{ height: 10 }} />
                    <Button title="Volver a Lista" onPress={() => setItemEdit(null)} color="#2196F3" />
                    <View style={{ height: 10 }} />
                    <Button title="Cerrar" onPress={() => setEditModalVisible(false)} color="#f44336" />
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  selectorContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectorButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectorButtonActive: {
    backgroundColor: '#2196F3',
  },
  selectorButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  selectorButtonTextActive: {
    color: '#fff',
  },
  apiInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  crudButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  infoText: {
    fontSize: 13,
    color: '#2196F3',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  modalButtons: {
    marginTop: 16,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
});

export default HunterXHunterScreen;
