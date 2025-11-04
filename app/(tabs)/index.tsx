import { usePersonaje } from '@/components/PersonajeContext';
import { useImagen } from '@/components/ImagenContext';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Alert, Button, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// APIs disponibles - Todas las fuentes
const APIS = [
  {
    nombre: 'MongoDB',
    personajes: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes',
    habilidades: 'https://api-hunter-x-hunter-mongodb.up.railway.app/api/habilidades',
  },
  {
    nombre: 'MySQL',
    personajes: 'https://api-hunter-x-hunter-mysql.up.railway.app/api/personajes',
    habilidades: 'https://api-hunter-x-hunter-mysql.up.railway.app/api/habilidades',
  }
];

const TabIndexScreen: React.FC = () => {
  // Selector de API: MongoDB o MySQL
  const [apiType, setApiType] = useState<number>(0); // índice del array APIS
  const [dataType, setDataType] = useState<'personajes' | 'habilidades'>('personajes');
  
  const API_URL = APIS[apiType][dataType];
  const API_SOURCE = APIS[apiType].nombre; // Guardamos la fuente para el contexto
  const [showEditSection, setShowEditSection] = useState<'caballero' | 'batalla'>('caballero');

  // --- lógica de gestos ---
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);


  // Gestos con GestureDetector (solo móvil)
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = baseScale.value * e.scale;
    })
    .onEnd(() => {
      baseScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = lastTranslateX.value + e.translationX;
      translateY.value = lastTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      scale.value = withSpring(1);
      baseScale.value = 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      lastTranslateX.value = 0;
      lastTranslateY.value = 0;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value }
    ] as any // Forzar el tipo para evitar error de tipo
  }));
  // Estado para edición de personaje y batallas
  const [personajeEdit, setPersonajeEdit] = useState<any>(null);
  const [batallasEdit, setBatallasEdit] = useState<any[]>([]);

  // useEffect para batallasEdit
  React.useEffect(() => {
    if (personajeEdit && personajeEdit.nombre) {
      fetch(`${API_URL}/api/batallas/${encodeURIComponent(personajeEdit.nombre)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setBatallasEdit(data))
        .catch(() => setBatallasEdit([]));
    } else {
      setBatallasEdit([]);
    }
  }, [personajeEdit]);
  const [nombre, setNombre] = useState('');
  const { personaje, setPersonaje } = usePersonaje();
  const { imagen, setImagen } = useImagen();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '', signo: '', rango: '', constelacion: '', genero: '', descripcion: '',
    fecha: '', participantes: '', ganador: '', ubicacion: '', comentario: '',
    imagen: '',
    batallas: []
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);

  const pickEditImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEditImage(result.assets[0].uri);
        Alert.alert('Imagen seleccionada', 'La imagen se ha cargado correctamente');
      } else {
        Alert.alert('Error', 'No se seleccionó ninguna imagen');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de imágenes');
    }
  };

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        Alert.alert('Imagen seleccionada', 'La imagen se ha cargado correctamente');
      } else {
        Alert.alert('Error', 'No se seleccionó ninguna imagen');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el selector de imágenes');
    }
  };

  const consultarPersonaje = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Aviso', 'Ingresa el nombre del personaje');
        return;
      }
      
      // Buscar en la lista de personajes
      const res = await fetch(API_URL);
      if (res.ok) {
        const items = await res.json();
        const found = items.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
        
        if (found) {
          // Agregar la fuente de API al personaje
          const personajeConFuente = { ...found, fuente: API_SOURCE };
          setPersonaje(personajeConFuente);
          
          let imgUrl = null;
          if (found.urlImagen) {
            imgUrl = found.urlImagen.startsWith('http') ? found.urlImagen : found.urlImagen;
          }
          setImagen(imgUrl);
          
          if (Platform.OS === 'web') {
            window.alert(`Personaje encontrado: ${found.nombre}`);
          } else {
            Alert.alert('Personaje encontrado', `Nombre: ${found.nombre}\n\nVe a About para ver detalles completos`);
          }
        } else {
          setPersonaje(null);
          setImagen(null);
          if (Platform.OS === 'web') {
            window.alert('No existe en la base de datos');
          } else {
            Alert.alert('No encontrado', 'No existe en la base de datos');
          }
        }
      } else {
        setPersonaje(null);
        setImagen(null);
        Alert.alert('Error', 'No se pudo consultar');
      }
    } catch {
      setPersonaje(null);
      if (Platform.OS === 'web') {
        window.alert('Error de conexión');
      } else {
        Alert.alert('Error de conexión');
      }
    }
  };

  const [modificarModalVisible, setModificarModalVisible] = useState(false);
  const [personajesLista, setPersonajesLista] = useState<any[]>([]);

  return (
    <ScrollView>
      {/* Selector de API */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginTop: 20 }}>
        {APIS.map((api, index) => (
          <TouchableOpacity
            key={api.nombre}
            style={{
              padding: 10,
              marginHorizontal: 4,
              backgroundColor: apiType === index ? '#2196F3' : '#e0e0e0',
              borderRadius: 8
            }}
            onPress={() => setApiType(index)}
          >
            <Text style={{ color: apiType === index ? '#fff' : '#666', fontWeight: '600' }}>{api.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Selector de Entidad */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        <TouchableOpacity
          style={{
            padding: 10,
            marginHorizontal: 4,
            backgroundColor: dataType === 'personajes' ? '#4CAF50' : '#e0e0e0',
            borderRadius: 8
          }}
          onPress={() => setDataType('personajes')}
        >
          <Text style={{ color: dataType === 'personajes' ? '#fff' : '#666', fontWeight: '600' }}>Personajes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            marginHorizontal: 4,
            backgroundColor: dataType === 'habilidades' ? '#FF9800' : '#e0e0e0',
            borderRadius: 8
          }}
          onPress={() => setDataType('habilidades')}
        >
          <Text style={{ color: dataType === 'habilidades' ? '#fff' : '#666', fontWeight: '600' }}>Habilidades</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        placeholder={`Nombre del ${dataType === 'personajes' ? 'personaje' : 'habilidad'}`}
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, margin: 10, padding: 8, borderRadius: 8 }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10, gap: 8, paddingHorizontal: 8 }}>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Consultar" onPress={consultarPersonaje} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title={`Insertar ${dataType === 'personajes' ? 'Personaje' : 'Habilidad'}`} onPress={() => setModalVisible(true)} color="#4CAF50" />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title={`Eliminar ${dataType === 'personajes' ? 'Personaje' : 'Habilidad'}`} color="#e74c3c" onPress={async () => {
            if (!nombre.trim()) {
              Alert.alert('Aviso', `Ingresa el nombre del ${dataType === 'personajes' ? 'personaje' : 'habilidad'} a eliminar`);
              return;
            }
            try {
              // Buscar el item primero
              const res = await fetch(API_URL);
              if (res.ok) {
                const items = await res.json();
                const found = items.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
                
                if (found) {
                  const deleteRes = await fetch(`${API_URL}/${found._id || found.id}`, {
                    method: 'DELETE',
                  });
                  
                  if (deleteRes.ok) {
                    Alert.alert('Eliminado', `${dataType === 'personajes' ? 'Personaje' : 'Habilidad'} eliminado correctamente`);
                    setPersonaje(null);
                    setImagen(null);
                    setNombre('');
                  } else {
                    Alert.alert('Error', 'No se pudo eliminar');
                  }
                } else {
                  Alert.alert('No encontrado', 'No existe en la base de datos');
                }
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor');
            }
          }} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title={`Listar/Modificar ${dataType === 'personajes' ? 'Personajes' : 'Habilidades'}`} color="#2980b9" onPress={async () => {
            try {
              const res = await fetch(API_URL);
              if (res.ok) {
                const lista = await res.json();
                setPersonajeEdit(null);
                setPersonajesLista(lista);
                setModificarModalVisible(true);
              } else {
                Alert.alert('Error', 'No se pudo obtener la lista');
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor');
            }
          }} />
        </View>
      </View>
      {/* Modal para insertar caballero y batallas */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setModalVisible(false)}
          />
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 14, width: '96%', maxHeight: '92%' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Insertar Caballero y Batallas</Text>
              {formError && (
                <Text style={{ color: '#e74c3c', marginBottom: 8, textAlign: 'center' }}>{formError}</Text>
              )}
              <TextInput
                placeholder="Nombre *"
                value={form.nombre}
                onChangeText={v => setForm(f => ({ ...f, nombre: v }))}
                style={[styles.input, !form.nombre.trim() && { borderColor: '#e74c3c', backgroundColor: '#fff5f5' }]}
              />
              <TextInput placeholder="Signo" value={form.signo} onChangeText={v => setForm(f => ({ ...f, signo: v }))} style={styles.input} />
              <TextInput placeholder="Rango" value={form.rango} onChangeText={v => setForm(f => ({ ...f, rango: v }))} style={styles.input} />
              <TextInput placeholder="Constelación" value={form.constelacion} onChangeText={v => setForm(f => ({ ...f, constelacion: v }))} style={styles.input} />
              <TextInput placeholder="Género" value={form.genero} onChangeText={v => setForm(f => ({ ...f, genero: v }))} style={styles.input} />
              <TextInput placeholder="Descripción" value={form.descripcion} onChangeText={v => setForm(f => ({ ...f, descripcion: v }))} style={styles.input} />
              {/* Imagen: picker en móvil, URL en web */}
              {Platform.OS === 'web' ? (
                <TextInput
                  placeholder="URL de imagen *"
                  value={form.imagen}
                  onChangeText={v => setForm(f => ({ ...f, imagen: v }))}
                  style={[styles.input, !form.imagen.trim() && { borderColor: '#e74c3c', backgroundColor: '#fff5f5' }]}
                />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                  <Button title="Seleccionar Imagen" onPress={pickImage} color="#6C3483" />
                  {!image && <Text style={{ marginLeft: 10, color: '#e74c3c' }}>Obligatorio</Text>}
                  {image && <Text style={{ marginLeft: 10, color: '#333' }}>Imagen lista</Text>}
                </View>
              )}
              {/* Batallas: lista editable */}
              <Text style={{ fontSize: 16, marginTop: 16, marginBottom: 8, textAlign: 'center' }}>Batallas *</Text>
              {(form.batallas || []).map((batalla, idx) => (
                <View key={idx} style={{ marginBottom: 12, padding: 8, borderRadius: 8, backgroundColor: '#f6f6f6' }}>
                  <TextInput
                    placeholder="Fecha *"
                    value={batalla.fecha || ''}
                    onChangeText={v => {
                      const nuevas = [...(form.batallas || [])];
                      nuevas[idx] = { ...nuevas[idx], fecha: v };
                      setForm(f => ({ ...f, batallas: nuevas }));
                    }}
                    style={[styles.input, !batalla.fecha?.trim() && { borderColor: '#e74c3c', backgroundColor: '#fff5f5' }]}
                  />
                  <TextInput placeholder="Participantes (separados por coma)" value={batalla.participantes || ''} onChangeText={v => {
                    const nuevas = [...(form.batallas || [])];
                    nuevas[idx] = { ...nuevas[idx], participantes: v };
                    setForm(f => ({ ...f, batallas: nuevas }));
                  }} style={styles.input} />
                  <TextInput placeholder="Ganador" value={batalla.ganador || ''} onChangeText={v => {
                    const nuevas = [...(form.batallas || [])];
                    nuevas[idx] = { ...nuevas[idx], ganador: v };
                    setForm(f => ({ ...f, batallas: nuevas }));
                  }} style={styles.input} />
                  <TextInput placeholder="Ubicación" value={batalla.ubicacion || ''} onChangeText={v => {
                    const nuevas = [...(form.batallas || [])];
                    nuevas[idx] = { ...nuevas[idx], ubicacion: v };
                    setForm(f => ({ ...f, batallas: nuevas }));
                  }} style={styles.input} />
                  <TextInput placeholder="Comentario" value={batalla.comentario || ''} onChangeText={v => {
                    const nuevas = [...(form.batallas || [])];
                    nuevas[idx] = { ...nuevas[idx], comentario: v };
                    setForm(f => ({ ...f, batallas: nuevas }));
                  }} style={styles.input} />
                  <Button title="Eliminar Batalla" color="#e74c3c" onPress={() => {
                    const nuevas = [...(form.batallas || [])];
                    nuevas.splice(idx, 1);
                    setForm(f => ({ ...f, batallas: nuevas }));
                  }} />
                </View>
              ))}
              <Button title="Agregar Batalla" color="#2196F3" onPress={() => {
                setForm(f => ({ ...f, batallas: [...(f.batallas || []), { fecha: '', participantes: '', ganador: '', ubicacion: '', comentario: '' }] }));
              }} />
              <Button title="Insertar" color="#4CAF50" onPress={async () => {
                // Validaciones
                if (!form.nombre.trim()) {
                  setFormError('El nombre es obligatorio.');
                  return;
                }
                if ((Platform.OS === 'web' && !form.imagen.trim()) || (Platform.OS !== 'web' && !image)) {
                  setFormError('La imagen es obligatoria.');
                  return;
                }
                if (!form.batallas.length) {
                  setFormError('Debes agregar al menos una batalla.');
                  return;
                }
                if (form.batallas.some(b => !b.fecha?.trim())) {
                  setFormError('Todas las batallas deben tener fecha.');
                  return;
                }
                setFormError(null);
                try {
                  // Imagen: en móvil, usar la seleccionada; en web, usar la URL
                  let imagenFinal = Platform.OS === 'web' ? form.imagen : image;
                  // Participantes: convertir a array si es string
                  const batallasFinal = (form.batallas || []).map(b => ({
                    ...b,
                    participantes: typeof b.participantes === 'string' ? b.participantes.split(',').map(p => p.trim()) : b.participantes
                  }));
                  const body = { ...form, imagen: imagenFinal, batallas: batallasFinal };
                  const res = await fetch(`${API_URL}/api/caballeros`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                  });
                  if (res.ok) {
                    Alert.alert('Insertado', 'Caballero y batallas insertados correctamente');
                    setModalVisible(false);
                  } else {
                    Alert.alert('Error', 'No se pudo insertar el caballero');
                  }
                } catch {
                  Alert.alert('Error', 'No se pudo conectar al servidor.');
                }
              }} />
              <Button title="Cerrar" color="#f44336" onPress={() => setModalVisible(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={modificarModalVisible} animationType="slide" transparent={true} onRequestClose={() => setModificarModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setModificarModalVisible(false)}
          />
          <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 14, width: '96%', maxHeight: '92%' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Modificar Personaje</Text>
              {!personajeEdit ? (
                <View>
                  <Text style={{ marginBottom: 10 }}>Selecciona un personaje para editar:</Text>
                  {personajesLista.map((c) => (
                    <TouchableOpacity key={c._id} style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => setPersonajeEdit(c)}>
                      <Text>{c.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                  <Button title="Cerrar" onPress={() => setModificarModalVisible(false)} color="#f44336" />
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
                    <Button title="Datos del Personaje" onPress={() => setShowEditSection('caballero')} color="#2196F3" />
                    <View style={{ width: 10 }} />
                    <Button title="Batallas" onPress={() => setShowEditSection('batalla')} color="#6C3483" />
                  </View>
                  <View style={{ minHeight: 220, maxHeight: 400, backgroundColor: '#fff', paddingBottom: 8 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                      {showEditSection === 'caballero' && (
                        <View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Nombre:</Text>
                            <TextInput value={personajeEdit.nombre} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, nombre: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Signo:</Text>
                            <TextInput value={personajeEdit.signo} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, signo: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Rango:</Text>
                            <TextInput value={personajeEdit.rango} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, rango: v }))} style={styles.input} />
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.label}>Constelación:</Text>
                            <TextInput value={personajeEdit.constelacion} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, constelacion: v }))} style={styles.input} />
                          </View>
                          <Button title="Actualizar Personaje" color="#4CAF50" onPress={async () => {
                            try {
                              const res = await fetch(`${API_URL}/api/caballero/${encodeURIComponent(personajeEdit.nombre)}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  signo: personajeEdit.signo,
                                  rango: personajeEdit.rango,
                                  constelacion: personajeEdit.constelacion
                                })
                              });
                              if (res.ok) {
                                Alert.alert('Actualizado', 'Personaje actualizado correctamente');
                              } else {
                                Alert.alert('Error', 'No se pudo actualizar el personaje');
                              }
                            } catch {
                              Alert.alert('Error', 'No se pudo conectar al servidor.');
                            }
                          }} />
                        </View>
                      )}
                      {showEditSection === 'batalla' && (
                        <View>
                          {batallasEdit.length === 0 ? (
                            <Text style={{ color: '#888', marginBottom: 8 }}>No hay batallas registradas para este personaje.</Text>
                          ) : (
                            <>
                              {batallasEdit.map((batalla, idx) => (
                                <View key={batalla._id || idx} style={{ marginBottom: 16, padding: 10, borderRadius: 8, backgroundColor: '#f6f6f6', borderWidth: 1, borderColor: '#eee' }}>
                                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Batalla #{idx + 1}</Text>
                                  <TextInput
                                    style={styles.input}
                                    value={batalla.fecha || ''}
                                    placeholder="Fecha"
                                    onChangeText={v => {
                                      const nuevas = [...batallasEdit];
                                      nuevas[idx] = { ...nuevas[idx], fecha: v };
                                      setBatallasEdit(nuevas);
                                    }}
                                  />
                                  <TextInput
                                    style={styles.input}
                                    value={batalla.participantes || ''}
                                    placeholder="Participantes"
                                    onChangeText={v => {
                                      const nuevas = [...batallasEdit];
                                      nuevas[idx] = { ...nuevas[idx], participantes: v };
                                      setBatallasEdit(nuevas);
                                    }}
                                  />
                                  <TextInput
                                    style={styles.input}
                                    value={batalla.ganador || ''}
                                    placeholder="Ganador"
                                    onChangeText={v => {
                                      const nuevas = [...batallasEdit];
                                      nuevas[idx] = { ...nuevas[idx], ganador: v };
                                      setBatallasEdit(nuevas);
                                    }}
                                  />
                                  <TextInput
                                    style={styles.input}
                                    value={batalla.ubicacion || ''}
                                    placeholder="Ubicación"
                                    onChangeText={v => {
                                      const nuevas = [...batallasEdit];
                                      nuevas[idx] = { ...nuevas[idx], ubicacion: v };
                                      setBatallasEdit(nuevas);
                                    }}
                                  />
                                  <TextInput
                                    style={styles.input}
                                    value={batalla.comentario || ''}
                                    placeholder="Comentario"
                                    onChangeText={v => {
                                      const nuevas = [...batallasEdit];
                                      nuevas[idx] = { ...nuevas[idx], comentario: v };
                                      setBatallasEdit(nuevas);
                                    }}
                                  />
                                </View>
                              ))}
                              <Button title="Actualizar Batallas" color="#4CAF50" onPress={async () => {
                                try {
                                  const res = await fetch(`${API_URL}/api/batallas/${encodeURIComponent(personajeEdit.nombre)}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(batallasEdit)
                                  });
                                  if (res.ok) {
                                    Alert.alert('Actualizado', 'Batallas actualizadas correctamente');
                                  } else {
                                    Alert.alert('Error', 'No se pudo actualizar las batallas');
                                  }
                                } catch {
                                  Alert.alert('Error', 'No se pudo conectar al servidor.');
                                }
                              }} />
                            </>
                          )}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Imagen principal y datos */}
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        {imagen ? (
          Platform.OS !== 'web' ? (
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={[animatedImageStyle, { width: '100%', maxWidth: 400, height: 220, borderRadius: 18, backgroundColor: '#fff', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}> 
                <Image
                  source={{ uri: imagen }}
                  style={{ width: '100%', height: 200, borderRadius: 18 }}
                  resizeMode="contain"
                  onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
                />
              </Animated.View>
            </GestureDetector>
          ) : (
            <Animated.View style={[animatedImageStyle, { width: '100%', maxWidth: 400, height: 220, borderRadius: 18, backgroundColor: '#fff', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}> 
              <Image
                source={{ uri: imagen }}
                style={{ width: '100%', height: 200, borderRadius: 18 }}
                resizeMode="contain"
                onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
              />
            </Animated.View>
          )
        ) : (
          <View style={{ minWidth: 220, minHeight: 140, borderRadius: 18, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#aaa' }}>Sin imagen</Text>
          </View>
        )}
        {personaje && (
          <View style={{ width: '100%', maxWidth: 400, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 4, textAlign: 'center' }}>Nombre: {personaje.nombre}</Text>
            {dataType === 'personajes' && (
              <>
                <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>📊 Fuente: {personaje.fuente || API_SOURCE}</Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' }}>Ve a About para ver todos los detalles y habilidades</Text>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  localBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  label: {
    width: 110,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#f3e6fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    minWidth: 70,
  },
});

export default TabIndexScreen;