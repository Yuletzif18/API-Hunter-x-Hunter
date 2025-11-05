import { useAuth } from '@/components/AuthContext';
import { useImagen } from '@/components/ImagenContext';
import { usePersonaje } from '@/components/PersonajeContext';
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
  const { isAdmin, token } = useAuth();
  const [showEditSection, setShowEditSection] = useState<'personaje' | 'habilidad'>('personaje');

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
    ] as any
  }));

  // Estado para edición de personaje y habilidades
  const [personajeEdit, setPersonajeEdit] = useState<any>(null);
  const [habilidadesEdit, setHabilidadesEdit] = useState<any[]>([]);

  // useEffect para habilidadesEdit - cargar habilidades del personaje
  React.useEffect(() => {
    if (personajeEdit && personajeEdit.nombre && personajeEdit.fuente) {
      const API_HABILIDADES = personajeEdit.fuente === 'MongoDB' 
        ? APIS[0].habilidades 
        : APIS[1].habilidades;
      
      fetch(API_HABILIDADES)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          // Filtrar habilidades que pertenecen a este personaje
          const habilidadesPersonaje = data.filter((h: any) => 
            h.personaje?.toLowerCase() === personajeEdit.nombre.toLowerCase()
          );
          setHabilidadesEdit(habilidadesPersonaje);
        })
        .catch(() => setHabilidadesEdit([]));
    } else {
      setHabilidadesEdit([]);
    }
  }, [personajeEdit]);

  const [nombre, setNombre] = useState('');
  const { personaje, setPersonaje } = usePersonaje();
  const { imagen, setImagen } = useImagen();
  
  // Estados para el modal de insertar
  const [modalVisible, setModalVisible] = useState(false);
  const [apiSeleccionada, setApiSeleccionada] = useState<number>(0); // Para elegir dónde insertar
  const [formPersonaje, setFormPersonaje] = useState({
    nombre: '', edad: '', altura: '', peso: '', genero: '', origen: '', 
    habilidad: '', descripcion: '', urlImagen: ''
  });
  const [formHabilidades, setFormHabilidades] = useState<any[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  // Helper para agregar token a las peticiones
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      console.error('❌ fetchWithAuth: No hay token disponible');
      throw new Error('No hay token de autenticación');
    }
    
    console.log('🔐 fetchWithAuth:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      ...(options.headers as Record<string, string> || {})
    };
    
    // Si hay body y no se especificó Content-Type, agregarlo
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    
    console.log('📤 Headers:', headers);
    
    return fetch(url, { ...options, headers });
  };

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
      
      // Buscar en AMBAS bases de datos
      let personajeEncontrado = null;
      let fuenteEncontrada = '';
      
      // Intentar MongoDB primero
      try {
        const resMongo = await fetchWithAuth(APIS[0].personajes);
        if (resMongo.ok) {
          const itemsMongo = await resMongo.json();
          const foundMongo = itemsMongo.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
          if (foundMongo) {
            personajeEncontrado = foundMongo;
            fuenteEncontrada = 'MongoDB';
          }
        }
      } catch (e) {
        console.log('Error buscando en MongoDB:', e);
      }
      
      // Si no se encontró en MongoDB, buscar en MySQL
      if (!personajeEncontrado) {
        try {
          const resMySQL = await fetchWithAuth(APIS[1].personajes);
          if (resMySQL.ok) {
            const itemsMySQL = await resMySQL.json();
            const foundMySQL = itemsMySQL.find((i: any) => i.nombre.toLowerCase() === nombre.toLowerCase());
            if (foundMySQL) {
              personajeEncontrado = foundMySQL;
              fuenteEncontrada = 'MySQL';
            }
          }
        } catch (e) {
          console.log('Error buscando en MySQL:', e);
        }
      }
      
      if (personajeEncontrado) {
        // Agregar la fuente de API al personaje
        const personajeConFuente = { ...personajeEncontrado, fuente: fuenteEncontrada };
        setPersonaje(personajeConFuente);
        
        let imgUrl = null;
        if (personajeEncontrado.urlImagen) {
          imgUrl = personajeEncontrado.urlImagen.startsWith('http') ? personajeEncontrado.urlImagen : personajeEncontrado.urlImagen;
        }
        setImagen(imgUrl);
        
        if (Platform.OS === 'web') {
          window.alert(`Personaje encontrado: ${personajeEncontrado.nombre}\nBase de datos: ${fuenteEncontrada}`);
        } else {
          Alert.alert('Personaje encontrado', `Nombre: ${personajeEncontrado.nombre}\nBase de datos: ${fuenteEncontrada}\n\nVe a About para ver detalles completos`);
        }
      } else {
        setPersonaje(null);
        setImagen(null);
        if (Platform.OS === 'web') {
          window.alert('No existe en ninguna base de datos');
        } else {
          Alert.alert('No encontrado', 'El personaje no existe en ninguna base de datos (MongoDB ni MySQL)');
        }
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

  const insertarPersonaje = async () => {
    // Validaciones
    if (!formPersonaje.nombre.trim()) {
      setFormError('El nombre es obligatorio.');
      return;
    }
    if ((Platform.OS === 'web' && !formPersonaje.urlImagen.trim()) || (Platform.OS !== 'web' && !image)) {
      setFormError('La imagen es obligatoria.');
      return;
    }
    
    setFormError(null);
    
    try {
      const API_BASE_PERSONAJES = APIS[apiSeleccionada].personajes;
      const API_BASE_HABILIDADES = APIS[apiSeleccionada].habilidades;
      const fuenteNombre = APIS[apiSeleccionada].nombre;
      
      // Preparar datos del personaje
      const personajeData = {
        ...formPersonaje,
        urlImagen: Platform.OS === 'web' ? formPersonaje.urlImagen : image,
        edad: formPersonaje.edad ? parseInt(formPersonaje.edad) : undefined,
        altura: formPersonaje.altura ? parseInt(formPersonaje.altura) : undefined,
        peso: formPersonaje.peso ? parseInt(formPersonaje.peso) : undefined,
      };
      
      console.log('➕ Insertando personaje:', formPersonaje.nombre, 'en', fuenteNombre);
      
      // Insertar personaje
      const resPersonaje = await fetchWithAuth(API_BASE_PERSONAJES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personajeData)
      });
      
      if (resPersonaje.ok) {
        let habilidadesExitosas = 0;
        let habilidadesError = 0;
        
        // Si hay habilidades, insertarlas
        if (formHabilidades.length > 0) {
          for (const habilidad of formHabilidades) {
            const habilidadData = {
              ...habilidad,
              personaje: formPersonaje.nombre // Asociar con el personaje
            };
            
            console.log('➕ Insertando habilidad:', habilidad.nombre, 'para', formPersonaje.nombre);
            
            const resHabilidad = await fetchWithAuth(API_BASE_HABILIDADES, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(habilidadData)
            });
            
            if (resHabilidad.ok) {
              habilidadesExitosas++;
            } else {
              habilidadesError++;
              const errorText = await resHabilidad.text().catch(() => 'Error desconocido');
              console.error('❌ Error insertando habilidad:', habilidad.nombre, resHabilidad.status, errorText);
            }
          }
        }
        
        if (habilidadesError === 0) {
          Alert.alert('✅ Insertado', `Personaje y ${habilidadesExitosas} habilidad(es) insertados correctamente en ${fuenteNombre}`);
        } else {
          Alert.alert('⚠️ Parcialmente insertado', `Personaje insertado, pero ${habilidadesError} habilidad(es) fallaron. Revisa la consola.`);
        }
        
        setModalVisible(false);
        
        // Limpiar formularios
        setFormPersonaje({
          nombre: '', edad: '', altura: '', peso: '', genero: '', origen: '', 
          habilidad: '', descripcion: '', urlImagen: ''
        });
        setFormHabilidades([]);
        setImage(null);
      } else {
        const errorText = await resPersonaje.text().catch(() => 'Error desconocido');
        console.error('❌ Error insertando personaje:', resPersonaje.status, errorText);
        Alert.alert('❌ Error', `No se pudo insertar el personaje\nEstado: ${resPersonaje.status}\nDetalle: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert('❌ Error de conexión', `No se pudo conectar al servidor\nDetalle: ${error}`);
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Hunter x Hunter - Personajes</Text>
        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>El sistema busca automáticamente en MongoDB y MySQL</Text>
        
        {!isAdmin && (
          <View style={{ 
            marginTop: 12, 
            padding: 10, 
            backgroundColor: '#fff3cd', 
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ffc107'
          }}>
            <Text style={{ fontSize: 12, color: '#856404', textAlign: 'center' }}>
              ⚠️ Modo Usuario: Solo puedes consultar personajes. El CRUD está deshabilitado.
            </Text>
          </View>
        )}
      </View>
      
      <TextInput
        placeholder="Nombre del personaje"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, margin: 10, padding: 8, borderRadius: 8 }}
      />
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10, gap: 8, paddingHorizontal: 8 }}>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button title="Consultar" onPress={consultarPersonaje} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button 
            title="Insertar Personaje" 
            onPress={() => {
              if (!isAdmin) {
                Alert.alert('⚠️ Permiso Denegado', 'Solo los administradores pueden insertar personajes');
                return;
              }
              setModalVisible(true);
            }} 
            color={isAdmin ? "#4CAF50" : "#999"} 
            disabled={!isAdmin}
          />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button 
            title="Eliminar Personaje" 
            color={isAdmin ? "#e74c3c" : "#999"} 
            disabled={!isAdmin}
            onPress={async () => {
            if (!isAdmin) {
              Alert.alert('⚠️ Permiso Denegado', 'Solo los administradores pueden eliminar personajes');
              return;
            }
            if (!nombre.trim()) {
              Alert.alert('Aviso', 'Ingresa el nombre del personaje a eliminar');
              return;
            }
            
            try {
              // Buscar el personaje en ambas bases de datos
              let personajeEncontrado = null;
              let fuenteEncontrada = '';
              let API_BASE_PERSONAJES = '';
              let API_BASE_HABILIDADES = '';
              
              // Buscar en MongoDB
              try {
                const resMongo = await fetch(APIS[0].personajes);
                if (resMongo.ok) {
                  const personajesMongo = await resMongo.json();
                  const found = personajesMongo.find((p: any) => p.nombre.toLowerCase() === nombre.toLowerCase());
                  if (found) {
                    personajeEncontrado = found;
                    fuenteEncontrada = 'MongoDB';
                    API_BASE_PERSONAJES = APIS[0].personajes;
                    API_BASE_HABILIDADES = APIS[0].habilidades;
                  }
                }
              } catch (e) {
                console.log('Error en MongoDB:', e);
              }
              
              // Si no se encontró en MongoDB, buscar en MySQL
              if (!personajeEncontrado) {
                try {
                  const resMySQL = await fetch(APIS[1].personajes);
                  if (resMySQL.ok) {
                    const personajesMySQL = await resMySQL.json();
                    const found = personajesMySQL.find((p: any) => p.nombre.toLowerCase() === nombre.toLowerCase());
                    if (found) {
                      personajeEncontrado = found;
                      fuenteEncontrada = 'MySQL';
                      API_BASE_PERSONAJES = APIS[1].personajes;
                      API_BASE_HABILIDADES = APIS[1].habilidades;
                    }
                  }
                } catch (e) {
                  console.log('Error en MySQL:', e);
                }
              }
              
              if (personajeEncontrado) {
                // Confirmar eliminación
                if (Platform.OS === 'web') {
                  if (window.confirm(`¿Eliminar a ${personajeEncontrado.nombre} y todas sus habilidades de ${fuenteEncontrada}?`)) {
                    // Primero eliminar habilidades asociadas por nombre del personaje
                    try {
                      const urlDeleteHabilidades = `${API_BASE_HABILIDADES}/${encodeURIComponent(personajeEncontrado.nombre)}`;
                      console.log('🗑️ Eliminando habilidades de:', personajeEncontrado.nombre, 'URL:', urlDeleteHabilidades);
                      
                      const resHab = await fetchWithAuth(urlDeleteHabilidades, {
                        method: 'DELETE'
                      });
                      
                      if (!resHab.ok) {
                        console.warn('⚠️ No se pudieron eliminar las habilidades (esto es normal si no tiene):', resHab.status);
                      }
                    } catch (e) {
                      console.log('Error eliminando habilidades:', e);
                    }
                    
                    // Luego eliminar el personaje por nombre
                    const urlDeletePersonaje = `${API_BASE_PERSONAJES}/${encodeURIComponent(personajeEncontrado.nombre)}`;
                    console.log('🗑️ Eliminando personaje:', personajeEncontrado.nombre, 'URL:', urlDeletePersonaje);
                    
                    const deleteRes = await fetchWithAuth(urlDeletePersonaje, {
                      method: 'DELETE'
                    });
                    
                    if (deleteRes.ok) {
                      window.alert('✅ Personaje y sus habilidades eliminados correctamente');
                      setPersonaje(null);
                      setImagen(null);
                      setNombre('');
                    } else {
                      const errorText = await deleteRes.text().catch(() => 'Error desconocido');
                      console.error('❌ Error al eliminar:', deleteRes.status, errorText);
                      window.alert(`❌ Error al eliminar el personaje\nEstado: ${deleteRes.status}\nURL: ${urlDeletePersonaje}\nDetalle: ${errorText}`);
                    }
                  }
                } else {
                  Alert.alert(
                    'Confirmar Eliminación',
                    `¿Eliminar a ${personajeEncontrado.nombre} y todas sus habilidades de ${fuenteEncontrada}?`,
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                          // Primero eliminar habilidades asociadas por nombre del personaje
                          try {
                            const urlDeleteHabilidades = `${API_BASE_HABILIDADES}/${encodeURIComponent(personajeEncontrado.nombre)}`;
                            console.log('🗑️ Eliminando habilidades de:', personajeEncontrado.nombre, 'URL:', urlDeleteHabilidades);
                            
                            const resHab = await fetchWithAuth(urlDeleteHabilidades, {
                              method: 'DELETE'
                            });
                            
                            if (!resHab.ok) {
                              console.warn('⚠️ No se pudieron eliminar las habilidades (esto es normal si no tiene):', resHab.status);
                            }
                          } catch (e) {
                            console.log('Error eliminando habilidades:', e);
                          }
                          
                          // Luego eliminar el personaje por nombre
                          const urlDeletePersonaje = `${API_BASE_PERSONAJES}/${encodeURIComponent(personajeEncontrado.nombre)}`;
                          console.log('🗑️ Eliminando personaje:', personajeEncontrado.nombre, 'URL:', urlDeletePersonaje);
                          
                          const deleteRes = await fetchWithAuth(urlDeletePersonaje, {
                            method: 'DELETE'
                          });
                          
                          if (deleteRes.ok) {
                            Alert.alert('✅ Eliminado', 'Personaje y sus habilidades eliminados correctamente');
                            setPersonaje(null);
                            setImagen(null);
                            setNombre('');
                          } else {
                            const errorText = await deleteRes.text().catch(() => 'Error desconocido');
                            console.error('❌ Error al eliminar:', deleteRes.status, errorText);
                            Alert.alert('❌ Error', `No se pudo eliminar el personaje\nEstado: ${deleteRes.status}\nURL: ${urlDeletePersonaje}\nDetalle: ${errorText}`);
                          }
                        }
                      }
                    ]
                  );
                }
              } else {
                Alert.alert('No encontrado', 'El personaje no existe en ninguna base de datos');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'No se pudo conectar al servidor');
            }
          }} />
        </View>
        <View style={{ flexBasis: '45%', minWidth: 120, margin: 4 }}>
          <Button 
            title={isAdmin ? "Listar/Modificar Personajes" : "Listar Personajes"} 
            color={isAdmin ? "#2980b9" : "#17a2b8"} 
            onPress={async () => {
            try {
              // Obtener personajes de AMBAS bases de datos
              let todosLosPersonajes: any[] = [];
              
              // Obtener de MongoDB
              try {
                const resMongo = await fetchWithAuth(APIS[0].personajes);
                if (resMongo.ok) {
                  const personajesMongo = await resMongo.json();
                  todosLosPersonajes = [...todosLosPersonajes, ...personajesMongo.map((p: any) => ({ ...p, fuente: 'MongoDB' }))];
                }
              } catch (e) {
                console.log('Error obteniendo de MongoDB:', e);
              }
              
              // Obtener de MySQL
              try {
                const resMySQL = await fetch(APIS[1].personajes);
                if (resMySQL.ok) {
                  const personajesMySQL = await resMySQL.json();
                  todosLosPersonajes = [...todosLosPersonajes, ...personajesMySQL.map((p: any) => ({ ...p, fuente: 'MySQL' }))];
                }
              } catch (e) {
                console.log('Error obteniendo de MySQL:', e);
              }
              
              if (todosLosPersonajes.length > 0) {
                setPersonajeEdit(null);
                setPersonajesLista(todosLosPersonajes);
                setModificarModalVisible(true);
              } else {
                Alert.alert('Aviso', 'No se encontraron personajes en ninguna base de datos');
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor');
            }
          }} />
        </View>
      </View>

      {/* Modal para insertar personaje y habilidades */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setModalVisible(false)}
          />
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 14, width: '96%', maxHeight: '92%' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={{ fontSize: 20, marginBottom: 10, textAlign: 'center' }}>Insertar Personaje y Habilidades</Text>
              
              {/* Selector de Base de Datos */}
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Selecciona la base de datos:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                {APIS.map((api, index) => (
                  <TouchableOpacity
                    key={api.nombre}
                    style={{
                      padding: 10,
                      marginHorizontal: 4,
                      backgroundColor: apiSeleccionada === index ? '#2196F3' : '#e0e0e0',
                      borderRadius: 8
                    }}
                    onPress={() => setApiSeleccionada(index)}
                  >
                    <Text style={{ color: apiSeleccionada === index ? '#fff' : '#666', fontWeight: '600' }}>{api.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {formError && (
                <Text style={{ color: '#e74c3c', marginBottom: 8, textAlign: 'center' }}>{formError}</Text>
              )}
              
              {/* Datos del Personaje */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Datos del Personaje</Text>
              <TextInput
                placeholder="Nombre *"
                value={formPersonaje.nombre}
                onChangeText={v => setFormPersonaje(f => ({ ...f, nombre: v }))}
                style={[styles.input, !formPersonaje.nombre.trim() && { borderColor: '#e74c3c', backgroundColor: '#fff5f5' }]}
              />
              <TextInput 
                placeholder="Edad" 
                value={formPersonaje.edad} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, edad: v }))} 
                style={styles.input} 
                keyboardType="numeric"
              />
              <TextInput 
                placeholder="Altura (cm)" 
                value={formPersonaje.altura} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, altura: v }))} 
                style={styles.input} 
                keyboardType="numeric"
              />
              <TextInput 
                placeholder="Peso (kg)" 
                value={formPersonaje.peso} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, peso: v }))} 
                style={styles.input} 
                keyboardType="numeric"
              />
              <TextInput 
                placeholder="Género" 
                value={formPersonaje.genero} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, genero: v }))} 
                style={styles.input} 
              />
              <TextInput 
                placeholder="Origen" 
                value={formPersonaje.origen} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, origen: v }))} 
                style={styles.input} 
              />
              <TextInput 
                placeholder="Habilidad Principal" 
                value={formPersonaje.habilidad} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, habilidad: v }))} 
                style={styles.input} 
              />
              <TextInput 
                placeholder="Descripción" 
                value={formPersonaje.descripcion} 
                onChangeText={v => setFormPersonaje(f => ({ ...f, descripcion: v }))} 
                style={[styles.input, { minHeight: 60 }]}
                multiline
              />
              
              {/* Imagen: picker en móvil, URL en web */}
              {Platform.OS === 'web' ? (
                <TextInput
                  placeholder="URL de imagen *"
                  value={formPersonaje.urlImagen}
                  onChangeText={v => setFormPersonaje(f => ({ ...f, urlImagen: v }))}
                  style={[styles.input, !formPersonaje.urlImagen.trim() && { borderColor: '#e74c3c', backgroundColor: '#fff5f5' }]}
                />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                  <Button title="Seleccionar Imagen" onPress={pickImage} color="#6C3483" />
                  {!image && <Text style={{ marginLeft: 10, color: '#e74c3c' }}>Obligatorio</Text>}
                  {image && <Text style={{ marginLeft: 10, color: '#333' }}>Imagen lista</Text>}
                </View>
              )}
              
              {/* Habilidades: lista editable */}
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Habilidades</Text>
              {formHabilidades.map((habilidad, idx) => (
                <View key={idx} style={{ marginBottom: 12, padding: 8, borderRadius: 8, backgroundColor: '#f6f6f6' }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Habilidad #{idx + 1}</Text>
                  <TextInput
                    placeholder="Nombre de la habilidad *"
                    value={habilidad.nombre || ''}
                    onChangeText={v => {
                      const nuevas = [...formHabilidades];
                      nuevas[idx] = { ...nuevas[idx], nombre: v };
                      setFormHabilidades(nuevas);
                    }}
                    style={styles.input}
                  />
                  <TextInput 
                    placeholder="Tipo" 
                    value={habilidad.tipo || ''} 
                    onChangeText={v => {
                      const nuevas = [...formHabilidades];
                      nuevas[idx] = { ...nuevas[idx], tipo: v };
                      setFormHabilidades(nuevas);
                    }} 
                    style={styles.input} 
                  />
                  <TextInput 
                    placeholder="Descripción" 
                    value={habilidad.descripcion || ''} 
                    onChangeText={v => {
                      const nuevas = [...formHabilidades];
                      nuevas[idx] = { ...nuevas[idx], descripcion: v };
                      setFormHabilidades(nuevas);
                    }} 
                    style={[styles.input, { minHeight: 60 }]}
                    multiline
                  />
                  <Button title="Eliminar Habilidad" color="#e74c3c" onPress={() => {
                    const nuevas = [...formHabilidades];
                    nuevas.splice(idx, 1);
                    setFormHabilidades(nuevas);
                  }} />
                </View>
              ))}
              <Button title="Agregar Habilidad" color="#FF9800" onPress={() => {
                setFormHabilidades([...formHabilidades, { nombre: '', tipo: '', descripcion: '', personaje: '' }]);
              }} />
              
              <View style={{ marginTop: 16 }}>
                <Button title="Insertar Personaje" color="#4CAF50" onPress={insertarPersonaje} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Button title="Cerrar" color="#f44336" onPress={() => setModalVisible(false)} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para modificar personajes */}
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
                  <ScrollView style={{ maxHeight: 300 }}>
                    {personajesLista.map((c, index) => (
                      <TouchableOpacity key={c._id || c.id || index} style={{ padding: 8, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => setPersonajeEdit(c)}>
                        <Text style={{ fontWeight: 'bold' }}>{c.nombre}</Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>BD: {c.fuente}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <Button title="Cerrar" onPress={() => setModificarModalVisible(false)} color="#f44336" />
                </View>
              ) : (
                <View>
                  <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 8 }}>Base de datos: {personajeEdit.fuente}</Text>
                  {!isAdmin && <Text style={{ fontSize: 12, color: '#e74c3c', textAlign: 'center', marginBottom: 8, fontWeight: 'bold' }}>⚠️ Solo lectura - Rol: Usuario</Text>}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
                    <Button title="Datos del Personaje" onPress={() => setShowEditSection('personaje')} color="#2196F3" />
                    <View style={{ width: 10 }} />
                    <Button title="Habilidades" onPress={() => setShowEditSection('habilidad')} color="#FF9800" />
                  </View>
                  <View style={{ minHeight: 220, maxHeight: 400, backgroundColor: '#fff', paddingBottom: 8 }}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                      {showEditSection === 'personaje' && (
                        <View>
                          <Text style={{ fontSize: 12, color: '#999', marginBottom: 8, textAlign: 'center' }}>{isAdmin ? 'Campos editables del personaje' : 'Información del personaje (solo lectura)'}</Text>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Nombre:</Text>
                            <TextInput value={personajeEdit.nombre || ''} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, nombre: v }))} style={styles.input} editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Edad:</Text>
                            <TextInput value={String(personajeEdit.edad || '')} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, edad: v }))} style={styles.input} keyboardType="numeric" editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Altura (cm):</Text>
                            <TextInput value={String(personajeEdit.altura || '')} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, altura: v }))} style={styles.input} keyboardType="numeric" editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Peso (kg):</Text>
                            <TextInput value={String(personajeEdit.peso || '')} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, peso: v }))} style={styles.input} keyboardType="numeric" editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Género:</Text>
                            <TextInput value={personajeEdit.genero || ''} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, genero: v }))} style={styles.input} editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Origen:</Text>
                            <TextInput value={personajeEdit.origen || ''} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, origen: v }))} style={styles.input} editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Habilidad Principal:</Text>
                            <TextInput value={personajeEdit.habilidad || ''} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, habilidad: v }))} style={styles.input} editable={isAdmin} />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>Descripción:</Text>
                            <TextInput 
                              value={personajeEdit.descripcion || ''} 
                              onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, descripcion: v }))} 
                              style={[styles.input, { minHeight: 60 }]} 
                              multiline 
                              numberOfLines={3}
                              editable={isAdmin}
                            />
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={styles.label}>URL Imagen:</Text>
                            <TextInput value={personajeEdit.urlImagen || ''} onChangeText={v => setPersonajeEdit((e: any) => ({ ...e, urlImagen: v }))} style={styles.input} editable={isAdmin} />
                          </View>
                          <Button 
                            title={isAdmin ? "Actualizar Personaje" : "Solo Lectura - Requiere Admin"} 
                            color={isAdmin ? "#4CAF50" : "#999"} 
                            disabled={!isAdmin}
                            onPress={async () => {
                            if (!isAdmin) {
                              Alert.alert('⚠️ Permiso Denegado', 'Solo los administradores pueden actualizar personajes');
                              return;
                            }
                            try {
                              if (!personajeEdit.nombre || !personajeEdit.nombre.trim()) {
                                Alert.alert('Error', 'El nombre del personaje es requerido');
                                return;
                              }

                              const API_BASE = personajeEdit.fuente === 'MongoDB' ? APIS[0].personajes : APIS[1].personajes;
                              const urlUpdate = `${API_BASE}/${encodeURIComponent(personajeEdit.nombre)}`;
                              
                              console.log('🔄 Actualizando personaje:', {
                                nombre: personajeEdit.nombre,
                                fuente: personajeEdit.fuente,
                                url: urlUpdate
                              });

                              const res = await fetchWithAuth(urlUpdate, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  nombre: personajeEdit.nombre,
                                  edad: personajeEdit.edad,
                                  altura: personajeEdit.altura,
                                  peso: personajeEdit.peso,
                                  genero: personajeEdit.genero,
                                  origen: personajeEdit.origen,
                                  habilidad: personajeEdit.habilidad,
                                  descripcion: personajeEdit.descripcion,
                                  urlImagen: personajeEdit.urlImagen
                                })
                              });
                              
                              if (res.ok) {
                                Alert.alert('✅ Actualizado', 'Personaje actualizado correctamente');
                              } else {
                                const errorText = await res.text().catch(() => 'Error desconocido');
                                console.error('❌ Error al actualizar:', res.status, errorText);
                                Alert.alert('❌ Error', `No se pudo actualizar el personaje.\nEstado: ${res.status}\nURL: ${urlUpdate}\nDetalle: ${errorText}`);
                              }
                            } catch (error) {
                              console.error('❌ Error de conexión:', error);
                              Alert.alert('❌ Error de conexión', `No se pudo conectar al servidor.\nDetalle: ${error}`);
                            }
                          }} />
                        </View>
                      )}
                      {showEditSection === 'habilidad' && (
                        <View>
                          {habilidadesEdit.length === 0 ? (
                            <Text style={{ color: '#888', marginBottom: 8, textAlign: 'center' }}>No hay habilidades registradas para este personaje.</Text>
                          ) : (
                            <>
                              <Text style={{ fontSize: 12, color: '#666', marginBottom: 8, textAlign: 'center' }}>Habilidades de {personajeEdit.nombre}</Text>
                              {habilidadesEdit.map((habilidad, idx) => (
                                <View key={habilidad._id || habilidad.id || idx} style={{ marginBottom: 16, padding: 10, borderRadius: 8, backgroundColor: '#f6f6f6', borderWidth: 1, borderColor: '#eee' }}>
                                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Habilidad #{idx + 1}</Text>
                                  <Text style={styles.label}>Nombre:</Text>
                                  <TextInput
                                    style={styles.input}
                                    value={habilidad.nombre || ''}
                                    placeholder="Nombre de la habilidad"
                                    editable={isAdmin}
                                    onChangeText={v => {
                                      const nuevas = [...habilidadesEdit];
                                      nuevas[idx] = { ...nuevas[idx], nombre: v };
                                      setHabilidadesEdit(nuevas);
                                    }}
                                  />
                                  <Text style={styles.label}>Tipo:</Text>
                                  <TextInput
                                    style={styles.input}
                                    value={habilidad.tipo || ''}
                                    placeholder="Tipo"
                                    editable={isAdmin}
                                    onChangeText={v => {
                                      const nuevas = [...habilidadesEdit];
                                      nuevas[idx] = { ...nuevas[idx], tipo: v };
                                      setHabilidadesEdit(nuevas);
                                    }}
                                  />
                                  <Text style={styles.label}>Descripción:</Text>
                                  <TextInput
                                    style={[styles.input, { minHeight: 60 }]}
                                    value={habilidad.descripcion || ''}
                                    placeholder="Descripción"
                                    multiline
                                    editable={isAdmin}
                                    onChangeText={v => {
                                      const nuevas = [...habilidadesEdit];
                                      nuevas[idx] = { ...nuevas[idx], descripcion: v };
                                      setHabilidadesEdit(nuevas);
                                    }}
                                  />
                                  {isAdmin && (<Button 
                                    title="Eliminar esta habilidad" 
                                    color="#e74c3c" 
                                    onPress={async () => {
                                      try {
                                        const API_BASE_HABILIDADES = personajeEdit.fuente === 'MongoDB' 
                                          ? APIS[0].habilidades 
                                          : APIS[1].habilidades;
                                        
                                        const urlDelete = `${API_BASE_HABILIDADES}/${encodeURIComponent(habilidad.nombre)}/${encodeURIComponent(personajeEdit.nombre)}`;
                                        console.log('🗑️ Eliminando habilidad:', habilidad.nombre, 'del personaje:', personajeEdit.nombre, 'URL:', urlDelete);
                                        
                                        const res = await fetchWithAuth(urlDelete, {
                                          method: 'DELETE'
                                        });
                                        
                                        if (res.ok) {
                                          Alert.alert('✅ Eliminada', 'Habilidad eliminada correctamente');
                                          // Actualizar la lista
                                          const nuevas = habilidadesEdit.filter((_, i) => i !== idx);
                                          setHabilidadesEdit(nuevas);
                                        } else {
                                          const errorText = await res.text().catch(() => 'Error desconocido');
                                          console.error('❌ Error al eliminar habilidad:', res.status, errorText);
                                          Alert.alert('❌ Error', `No se pudo eliminar la habilidad\nEstado: ${res.status}\nURL: ${urlDelete}\nDetalle: ${errorText}`);
                                        }
                                      } catch (error) {
                                        console.error('❌ Error de conexión:', error);
                                        Alert.alert('❌ Error de conexión', `No se pudo conectar al servidor\nDetalle: ${error}`);
                                      }
                                    }}
                                  />)}
                                </View>
                              ))}
                              {isAdmin && (<Button 
                                title="Actualizar Habilidades" 
                                color="#4CAF50" 
                                onPress={async () => {
                                  try {
                                    const API_BASE_HABILIDADES = personajeEdit.fuente === 'MongoDB' 
                                      ? APIS[0].habilidades 
                                      : APIS[1].habilidades;
                                    
                                    let errores = 0;
                                    let exitosos = 0;
                                    
                                    // Actualizar cada habilidad por nombre
                                    for (const habilidad of habilidadesEdit) {
                                      if (!habilidad.nombre || !habilidad.nombre.trim()) {
                                        console.warn('⚠️ Saltando habilidad sin nombre');
                                        continue;
                                      }
                                      
                                      const urlUpdate = `${API_BASE_HABILIDADES}/${encodeURIComponent(habilidad.nombre)}/${encodeURIComponent(personajeEdit.nombre)}`;
                                      console.log('🔄 Actualizando habilidad:', habilidad.nombre, 'URL:', urlUpdate);
                                      
                                      const res = await fetchWithAuth(urlUpdate, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          nombre: habilidad.nombre,
                                          tipo: habilidad.tipo,
                                          descripcion: habilidad.descripcion,
                                          personaje: habilidad.personaje
                                        })
                                      });
                                      
                                      if (res.ok) {
                                        exitosos++;
                                      } else {
                                        errores++;
                                        const errorText = await res.text().catch(() => 'Error desconocido');
                                        console.error('❌ Error actualizando habilidad:', habilidad.nombre, res.status, errorText);
                                      }
                                    }
                                    
                                    if (errores === 0) {
                                      Alert.alert('✅ Actualizado', `${exitosos} habilidad(es) actualizadas correctamente`);
                                    } else {
                                      Alert.alert('⚠️ Parcialmente actualizado', `${exitosos} exitosas, ${errores} con errores. Revisa la consola para detalles.`);
                                    }
                                  } catch (error) {
                                    console.error('❌ Error de conexión:', error);
                                    Alert.alert('❌ Error', `No se pudo actualizar las habilidades\nDetalle: ${error}`);
                                  }
                                }}
                              />)}
                            </>
                          )}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                  <Button title="Volver a la lista" onPress={() => setPersonajeEdit(null)} color="#666" />
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
            <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>📊 Fuente: {personaje.fuente}</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' }}>Ve a About para ver todos los detalles y habilidades</Text>
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
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 8,
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
