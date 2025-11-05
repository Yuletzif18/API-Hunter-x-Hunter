# 🔐 Sistema de Autenticación - Hunter x Hunter API

## 📋 Resumen

Se ha implementado un sistema completo de autenticación con roles (admin/usuario) para controlar el acceso al CRUD de personajes y habilidades.

## 🎯 Características Implementadas

### Backend (MongoDB)

#### 1. Modelo de Usuario
- **Ubicación**: `hxh-mongo-backend/models/Usuario.js`
- **Campos**:
  - `username`: Único, requerido
  - `password`: Encriptado con bcrypt
  - `rol`: `admin` | `usuario`
  - `createdAt`: Fecha de creación

#### 2. Autenticación JWT
- **Secret Key**: Configurable en `.env` como `JWT_SECRET`
- **Expiración**: 24 horas
- **Token incluye**: id, username, rol

#### 3. Endpoints de Autenticación
```
POST /api/auth/registro     - Registrar nuevo usuario
POST /api/auth/login         - Login (devuelve token JWT)
GET  /api/auth/verificar     - Verificar token válido
GET  /api/auth/usuarios      - Listar usuarios (solo admin)
```

#### 4. Middleware de Autorización
- **`verificarAuth`**: Valida token JWT
- **`verificarAdmin`**: Requiere rol admin
- **`verificarUsuario`**: Requiere autenticación

#### 5. Rutas Protegidas

**Personajes** (`/api/personajes`):
- `GET /` - Requiere autenticación (cualquier rol)
- `GET /:nombre` - Requiere autenticación
- `POST /` - Solo admin
- `PUT /:nombre` - Solo admin
- `DELETE /:nombre` - Solo admin

**Habilidades** (`/api/habilidades`):
- `GET /` - Requiere autenticación
- `GET /:nombre` - Requiere autenticación
- `POST /` - Solo admin
- `PUT /:nombre` - Solo admin
- `DELETE /:nombre` - Solo admin

### Frontend (Expo/React Native)

#### 1. AuthContext
- **Ubicación**: `components/AuthContext.tsx`
- **Funcionalidades**:
  - Login/Logout
  - Persistencia de sesión (localStorage/AsyncStorage)
  - Verificación automática de token
  - Estados: `isAuthenticated`, `isAdmin`, `usuario`, `token`

#### 2. Pantalla de Login
- **Ubicación**: `app/login.tsx`
- **Características**:
  - Formulario de login
  - Indicadores de carga
  - Información de credenciales de prueba
  - Redirección automática tras login exitoso

#### 3. Protección de Rutas
- **Ubicación**: `app/_layout.tsx`
- **Comportamiento**:
  - Usuarios no autenticados → Redirige a `/login`
  - Usuarios autenticados → Acceso a `/(tabs)`
  - Verificación en cada cambio de ruta

#### 4. Interfaz por Roles
- **Admin**:
  - ✅ Consultar personajes
  - ✅ Insertar personajes
  - ✅ Modificar personajes
  - ✅ Eliminar personajes
  - ✅ CRUD de habilidades

- **Usuario**:
  - ✅ Consultar personajes
  - ❌ Insertar (botón deshabilitado)
  - ❌ Modificar (botón deshabilitado)
  - ❌ Eliminar (botón deshabilitado)
  - ✅ Listar personajes (sin edición)

#### 5. Header con Información de Usuario
- Muestra username actual
- Badge de rol (👑 Admin o 👤 Usuario)
- Botón de logout

## 👤 Usuarios de Prueba

### Admin
```
Username: admin
Password: admin123
Permisos: CRUD completo
```

### Usuario Normal
```
Username: usuario1
Password: user123
Permisos: Solo lectura
```

## 🚀 Cómo Usar

### 1. Configurar Backend

```bash
cd hxh-mongo-backend

# Instalar dependencias
npm install

# Crear usuarios iniciales
node crear-usuarios.js

# Iniciar servidor
npm start
```

### 2. Configurar Frontend

```bash
# Desde la raíz del proyecto
npm install

# Iniciar app
npx expo start
```

### 3. Probar el Sistema

1. **Abrir la app** → Se mostrará la pantalla de login
2. **Login como admin**:
   - Username: `admin`
   - Password: `admin123`
   - Podrás usar todos los botones del CRUD
3. **Logout** y login como usuario:
   - Username: `usuario1`
   - Password: `user123`
   - Los botones de escritura estarán deshabilitados

## 📡 Peticiones HTTP con Autenticación

Todas las peticiones a las APIs protegidas deben incluir el header:
```
Authorization: Bearer {token}
```

Ejemplo en JavaScript:
```javascript
const response = await fetch('https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt (salt rounds: 10)
- ✅ Tokens JWT con expiración
- ✅ Verificación de roles en cada petición
- ✅ Middleware de autorización en todas las rutas protegidas
- ✅ Manejo de errores 401 (No autenticado) y 403 (Sin permisos)

## 📝 Variables de Entorno Necesarias

### Backend (`hxh-mongo-backend/.env`)
```env
MONGODB_URI_PERSONAJES=mongodb+srv://...
MONGODB_URI_HABILIDADES=mongodb+srv://...
JWT_SECRET=tu-secreto-super-seguro
PORT=4002
```

## 🎨 UI/UX

### Indicadores Visuales
- ⚠️ Badge amarillo: Modo usuario (solo lectura)
- 👑 Badge verde: Admin
- 👤 Badge amarillo: Usuario
- Botones deshabilitados: Color gris (#999)
- Botones activos: Colores distintivos por acción

### Mensajes de Error
- "⚠️ Permiso Denegado" - Al intentar CRUD sin ser admin
- "❌ Error" - Errores de conexión o servidor
- "Token inválido o expirado" - Sesión caducada

## 🛠️ Archivos Creados/Modificados

### Backend
- ✅ `models/Usuario.js` - Modelo de usuario
- ✅ `controllers/authController.js` - Lógica de autenticación
- ✅ `middleware/authMiddleware.js` - Middleware de autorización
- ✅ `routes/authRoutes.js` - Rutas de auth
- ✅ `crear-usuarios.js` - Script para crear usuarios
- ✅ `routes/personajeRoutes.js` - Protegido con middleware
- ✅ `routes/habilidad/habilidadRoutes.js` - Protegido con middleware
- ✅ `app.js` - Registro de rutas auth
- ✅ `package.json` - Dependencias: bcryptjs, jsonwebtoken

### Frontend
- ✅ `components/AuthContext.tsx` - Context completo de auth
- ✅ `app/login.tsx` - Pantalla de login
- ✅ `app/_layout.tsx` - Protección de rutas
- ✅ `app/(tabs)/_layout.tsx` - Header con usuario y logout
- ✅ `app/(tabs)/index.tsx` - UI con permisos por rol
- ✅ `package.json` - Dependencia: @react-native-async-storage/async-storage

## ✅ Testing

### Probar Autenticación
```bash
# Login
curl -X POST https://api-hunter-x-hunter-mongodb.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Respuesta incluye: token, usuario {id, username, rol}
```

### Probar Endpoint Protegido
```bash
# Sin token (Error 401)
curl https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes

# Con token
curl https://api-hunter-x-hunter-mongodb.up.railway.app/api/personajes \
  -H "Authorization: Bearer {tu-token-jwt}"
```

## 🔄 Flujo Completo

1. Usuario abre la app → Pantalla de login
2. Ingresa credenciales → Token guardado en localStorage/AsyncStorage
3. Redirección automática a `/(tabs)`
4. Cada fetch incluye `Authorization: Bearer {token}`
5. Backend valida token y rol
6. Si es admin: CRUD completo
7. Si es usuario: Solo lectura
8. Logout → Token eliminado → Vuelta a login

## 📊 Estados de Respuesta

- **200**: OK
- **201**: Created
- **400**: Bad Request (datos inválidos)
- **401**: Unauthorized (sin token o token inválido)
- **403**: Forbidden (sin permisos para la acción)
- **404**: Not Found
- **500**: Server Error

## 🎓 Agregar Nuevos Usuarios

### Opción 1: Usar el script
```bash
cd hxh-mongo-backend
node crear-usuarios.js
```

### Opción 2: Endpoint de registro
```bash
curl -X POST https://api-hunter-x-hunter-mongodb.up.railway.app/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "username":"nuevo_usuario",
    "password":"password123",
    "rol":"usuario"
  }'
```

## 🚨 Troubleshooting

### "Token inválido"
- Verificar que el token esté bien formado
- Revisar que no haya espacios en el header
- Confirmar que no haya expirado (24h)

### "Permiso denegado"
- Verificar rol del usuario
- Confirmar que la ruta requiera admin
- Revisar logs del backend

### "No se puede conectar"
- Verificar que el backend esté corriendo
- Confirmar URLs de las APIs
- Revisar configuración de CORS

---

**Desarrollado por**: Equipo Hunter x Hunter  
**Fecha**: Noviembre 2025  
**Versión**: 1.0.0
