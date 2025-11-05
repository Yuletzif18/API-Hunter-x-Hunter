# 🎯 API Hunter x Hunter - Fullstack App

Aplicación fullstack para gestión de personajes y habilidades de Hunter x Hunter. Incluye dos backends Node.js/Express (MongoDB y MySQL) desplegados en Railway, y frontend Expo/React Native con soporte para imágenes, gestos avanzados y búsqueda automática en múltiples bases de datos.

---

## ✨ Características

### Frontend (Expo/React Native)
- 📱 CRUD completo de personajes y habilidades
- 🔍 Búsqueda automática en MongoDB y MySQL (sin selección manual)
- 🖼️ Visualización de imágenes con gestos avanzados (pinch, pan, zoom)
- 📝 Edición completa de todos los campos de personajes
- ⚡ Gestión múltiple de habilidades por personaje
- 🗑️ Eliminación en cascada (personaje + habilidades)
- 📲 Responsive en móvil y web
- 🎨 Interfaz intuitiva con React Native Paper

### Backend (Node.js/Express)
- 🗄️ **Dual Database Support**: MongoDB Atlas + MySQL Railway
- 🔄 APIs RESTful con endpoints unificados
- 📚 Documentación Swagger/OpenAPI 3.1.0
- 🏥 Health check endpoints para Railway
- 🔒 CORS configurado para seguridad
- ⚡ Conexiones optimizadas con pools y retries
- 🌐 Desplegado en Railway con URLs públicas

---

## 🏗️ Arquitectura del Proyecto

```
API-hunterxhunter/
├── app/                          # Frontend Expo/React Native
│   ├── (tabs)/
│   │   ├── index.tsx            # CRUD unificado (consultar, insertar, listar, modificar, eliminar)
│   │   ├── about.tsx            # Vista de detalle con habilidades (detección automática de DB)
│   │   └── _layout.tsx          # Layout de tabs
│   └── components/
│       ├── PersonajeContext.tsx # Context API para compartir personaje seleccionado
│       └── ImagenContext.tsx    # Context para gestión de imágenes
│
├── hxh-mysql-backend/           # Backend MySQL + Sequelize
│   ├── controllers/
│   │   ├── personajeController.js
│   │   └── habilidad/habilidadController.js
│   ├── models/
│   │   ├── personaje.js
│   │   └── habilidad/habilidad.js
│   ├── routes/
│   │   ├── personajeRoutes.js
│   │   └── habilidad/habilidadRoutes.js
│   ├── docs/
│   │   └── openapi-hxh.yaml    # Documentación OpenAPI
│   ├── app.js                   # Servidor Express
│   ├── swagger.js               # Configuración Swagger UI
│   ├── railway.toml             # Config Railway
│   └── package.json
│
├── hxh-mongo-backend/           # Backend MongoDB + Mongoose
│   ├── controllers/
│   │   ├── personajeController.js
│   │   └── habilidad/habilidadController.js
│   ├── models/
│   │   ├── Personaje.js
│   │   └── habilidad/Habilidad.js
│   ├── routes/
│   │   ├── personajeRoutes.js
│   │   └── habilidad/habilidadRoutes.js
│   ├── docs/
│   │   └── openapi.yaml         # Documentación OpenAPI
│   ├── app.js                   # Servidor Express
│   ├── swagger.js               # Configuración Swagger UI
│   ├── railway.toml             # Config Railway
│   └── package.json
│
├── assets/                       # Imágenes y recursos
├── .env                         # Variables de entorno (NO SUBIR)
├── package.json
└── README.md
```

---

## 🚀 Instalación y Desarrollo

### 1. Clona el repositorio
```bash
git clone https://github.com/Yuletzif18/API-Hunter-x-Hunter.git
cd API-hunterxhunter
```

### 2. Configura las variables de entorno

**Frontend (.env en raíz):**
```env
# URLs de producción (Railway)
EXPO_PUBLIC_API_MONGODB=https://api-hunter-x-hunter-mongodb.up.railway.app
EXPO_PUBLIC_API_MYSQL=https://api-hunter-x-hunter-mysql.up.railway.app

# Para desarrollo local, usa:
# EXPO_PUBLIC_API_MONGODB=http://localhost:4002
# EXPO_PUBLIC_API_MYSQL=http://localhost:3002
```

**Backend MySQL (hxh-mysql-backend/.env):**
```env
DATABASE_URL=tu_url_mysql_railway
MYSQL_URI_PERSONAJES=tu_url_mysql_personajes
MYSQL_URI_HABILIDADES=tu_url_mysql_habilidades
PORT=3002
```

**Backend MongoDB (hxh-mongo-backend/.env):**
```env
MONGODB_URI_PERSONAJES=tu_url_mongodb_personajes
MONGODB_URI_HABILIDADES=tu_url_mongodb_habilidades
PORT=4002
```

### 3. Instala dependencias

**Frontend:**
```bash
npm install
```

**Backend MySQL:**
```bash
cd hxh-mysql-backend
npm install
cd ..
```

**Backend MongoDB:**
```bash
cd hxh-mongo-backend
npm install
cd ..
```

### 4. Ejecuta en desarrollo

**Backend MySQL:**
```bash
cd hxh-mysql-backend
node app.js
# Servidor en http://localhost:3002
# Swagger UI: http://localhost:3002/api-docs
```

**Backend MongoDB:**
```bash
cd hxh-mongo-backend
node app.js
# Servidor en http://localhost:4002
# Swagger UI: http://localhost:4002/api-docs
```

**Frontend:**
```bash
npx expo start
```

---

## 🌐 APIs Desplegadas en Railway

### 🔗 URLs de Producción

**MySQL Backend:**
- API Base: `https://api-hunter-x-hunter-mysql.up.railway.app`
- Swagger UI: `https://api-hunter-x-hunter-mysql.up.railway.app/api-docs`
- Health Check: `https://api-hunter-x-hunter-mysql.up.railway.app/health`

**MongoDB Backend:**
- API Base: `https://api-hunter-x-hunter-mongodb.up.railway.app`
- Swagger UI: `https://api-hunter-x-hunter-mongodb.up.railway.app/api-docs`
- Health Check: `https://api-hunter-x-hunter-mongodb.up.railway.app/health`

### 📋 Endpoints Principales

**Personajes:**
- `GET /api/personajes` - Obtener todos los personajes
- `POST /api/personajes` - Crear nuevo personaje
- `GET /api/personajes/{nombre}` - Obtener personaje por nombre
- `PUT /api/personajes/{nombre}` - Actualizar personaje
- `DELETE /api/personajes/{nombre}` - Eliminar personaje

**Habilidades:**
- `GET /api/habilidades` - Obtener todas las habilidades
- `POST /api/habilidades` - Crear nueva habilidad
- `GET /api/habilidades/{nombre}` - Obtener habilidades de un personaje
- `PUT /api/habilidades/{nombre}` - Actualizar habilidades
- `DELETE /api/habilidades/{nombre}` - Eliminar habilidades

---

## 🎯 Despliegue en Railway

### Configuración de Servicios

**1. Backend MySQL:**
```toml
# hxh-mysql-backend/railway.toml
[build]
builder = "nixpacks"
buildCommand = "npm install"

[deploy]
startCommand = "node app.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
healthcheckPath = "/health"
```

**2. Backend MongoDB:**
```toml
# hxh-mongo-backend/railway.toml
[build]
builder = "nixpacks"
buildCommand = "npm install"

[deploy]
startCommand = "node app.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
healthcheckPath = "/health"
```

### Variables de Entorno en Railway

**MySQL Service:**
- `DATABASE_URL` - Provisto automáticamente por Railway MySQL
- `PORT` - Asignado automáticamente por Railway

**MongoDB Service:**
- `MONGODB_URI_PERSONAJES` - Tu MongoDB Atlas URI
- `MONGODB_URI_HABILIDADES` - Tu MongoDB Atlas URI
- `PORT` - Asignado automáticamente por Railway

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Expo SDK 54.0.21** - Framework React Native
- **React Native 0.81.5** - UI Framework
- **React Native Gesture Handler** - Gestos avanzados
- **React Native Reanimated** - Animaciones fluidas
- **TypeScript** - Tipado estático

### Backend
- **Node.js 18.x** - Runtime JavaScript
- **Express 4.18.2** - Framework web
- **MongoDB + Mongoose 8.19.2** - Base de datos NoSQL
- **MySQL + Sequelize 6.35.0** - Base de datos SQL
- **Swagger UI Express** - Documentación interactiva
- **js-yaml** - Parser de YAML
- **cors** - Control de acceso CORS

### Infraestructura
- **Railway** - Hosting y despliegue continuo
- **MongoDB Atlas** - Base de datos MongoDB cloud
- **Railway MySQL** - Base de datos MySQL cloud
- **GitHub** - Control de versiones

---

## 📱 Funcionalidades de la App

### Consultar Personaje
1. Ingresa el nombre del personaje
2. El sistema busca **automáticamente** en MongoDB
3. Si no encuentra, busca en MySQL
4. Muestra el personaje con propiedad `fuente` (MongoDB/MySQL)

### Insertar Personaje
1. Selecciona la base de datos (MongoDB o MySQL)
2. Ingresa datos del personaje (9 campos)
3. Agrega múltiples habilidades (nombre, tipo, descripción)
4. Inserta en la BD seleccionada

### Listar y Modificar
1. Obtiene **todos** los personajes de ambas BDs
2. Muestra lista con fuente de cada uno
3. Al seleccionar, permite editar **todos** los campos
4. Permite editar/eliminar habilidades individualmente
5. Actualiza en la BD correcta automáticamente

### Eliminar Personaje
1. Busca en ambas bases de datos
2. Elimina **todas las habilidades** asociadas primero
3. Elimina el personaje
4. Confirmación de eliminación exitosa

---

## 🔒 Seguridad

- ✅ Variables de entorno para credenciales sensibles
- ✅ `.env` incluido en `.gitignore`
- ✅ CORS configurado para orígenes permitidos
- ✅ Validación de datos en backend
- ✅ Manejo de errores robusto
- ✅ Health checks para monitoring
- ✅ Conexiones con timeouts y retries

---

## 📚 Documentación API

La documentación completa de las APIs está disponible en Swagger UI:

- **MySQL Backend**: https://api-hunter-x-hunter-mysql.up.railway.app/api-docs
- **MongoDB Backend**: https://api-hunter-x-hunter-mongodb.up.railway.app/api-docs

Ambas APIs siguen el estándar **OpenAPI 3.1.0** con:
- Descripciones detalladas de cada endpoint
- Esquemas de request/response
- Ejemplos de uso
- Códigos de respuesta HTTP
- Modelos de datos completos

---

## 🎮 Scripts Útiles

### Frontend
```bash
npm start              # Inicia Expo
npm run android        # Abre en Android
npm run ios            # Abre en iOS
npm run web            # Abre en navegador
```

### Backend
```bash
# MySQL
cd hxh-mysql-backend
npm start              # Inicia servidor (node app.js)
npm run dev            # Modo desarrollo con nodemon

# MongoDB
cd hxh-mongo-backend
npm start              # Inicia servidor (node app.js)
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👤 Autor

**Yulet**
- GitHub: [@Yuletzif18](https://github.com/Yuletzif18)
- Repositorio: [API-Hunter-x-Hunter](https://github.com/Yuletzif18/API-Hunter-x-Hunter)

---

## 🙏 Agradecimientos

- Comunidad de Hunter x Hunter
- Expo Team por la excelente documentación
- Railway por el hosting gratuito
- MongoDB Atlas por la base de datos cloud

---

## 📝 Notas de Desarrollo

- Para desarrollo local con dispositivo físico, usa tu IP local en `.env`
- Railway proporciona HTTPS automáticamente
- Las bases de datos tienen conexiones separadas para Personajes y Habilidades
- El frontend detecta automáticamente la fuente de datos (MongoDB/MySQL)
- Los endpoints usan **nombre del personaje** como identificador, no ID

---

## 🐛 Reportar Issues

¿Encontraste un bug? [Abre un issue](https://github.com/Yuletzif18/API-Hunter-x-Hunter/issues)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**


---

## Características
- CRUD de caballeros y batallas
- Subida y visualización de imágenes (con ImagePicker y Multer)
- Gestos avanzados en imágenes (pinch, pan, double-tap)
- Responsive en móvil y web
- Backend seguro y desplegado en Render
- Variables de entorno para configuración segura

---

## Estructura del proyecto
```
├── app/                # Frontend Expo/React Native
│   ├── (tabs)/         # Pantallas principales
│   ├── components/     # Componentes reutilizables
│   └── ...
├── saintseiya-backend/ # Backend Node.js/Express
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
├── assets/             # Imágenes y recursos
├── .env                # Variables de entorno (no subir a GitHub)
├── package.json
├── README.md
└── ...
```

---

## Instalación y desarrollo

### 1. Clona el repositorio
```sh
git clone https://github.com/tu-usuario/stickersmash-caballeros.git
cd stickersmash-caballeros
```

### 2. Configura las variables de entorno
Crea un archivo `.env` en la raíz:
```
EXPO_PUBLIC_API_URL=http://localhost:3001   # Para desarrollo local
MONGODB_URI=tu_cadena_de_conexion           # Solo para backend
```
Agrega `.env` a `.gitignore`.

### 3. Instala dependencias
```sh
npm install
```

### 4. Ejecuta el backend
```sh
cd saintseiya-backend
npm install
node app.js
```

### 5. Ejecuta el frontend
```sh
cd ..
npx expo start
```

---

## Despliegue en Render

1. Sube el proyecto a GitHub.
2. Ve a https://dashboard.render.com/ y crea un nuevo Web Service.
3. Configura los comandos:
   - Build: `npm install`
   - Start: `node saintseiya-backend/app.js`
4. Agrega variables de entorno en Render:
   - `MONGODB_URI` (tu cadena de conexión)
   - `EXPO_PUBLIC_API_URL` (la URL pública de Render)
5. Render te dará una URL pública segura (HTTPS).
6. Actualiza `.env` en frontend con la URL pública para producción.

---

## Seguridad
- No subas `.env` ni credenciales a GitHub.
- Usa variables de entorno en Render.
- El backend valida y sanitiza los datos recibidos.
- CORS configurado para permitir solo orígenes necesarios.

---

## Tecnologías
- Node.js, Express, MongoDB, Mongoose
- Expo, React Native, React Native Gesture Handler, Reanimated
- Multer, ImagePicker
- Render (despliegue)

---

## Scripts útiles
- `npm run start`        # Inicia Expo
- `npm run android`      # Inicia en Android
- `npm run ios`          # Inicia en iOS
- `npm run web`          # Inicia en web
- `node saintseiya-backend/app.js` # Inicia backend

---

## Licencia
MIT

---

## Autor
- Yulet (tu nombre o usuario)
- Contacto: [tu-email]

---

## Contribuciones
¡Pull requests y sugerencias son bienvenidas!

---

## Demo
- [URL pública de Render](https://tu-app.onrender.com)

---

## Notas
- Para desarrollo local, usa tu IP en `.env` si pruebas en dispositivos físicos.
- Para producción, usa la URL pública de Render.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
