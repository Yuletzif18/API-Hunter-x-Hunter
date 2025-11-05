# Configuración de Deployment en Vercel

## Problema: Página de Autenticación de Vercel

Si al acceder a tu aplicación ves una página que dice "Vercel Authentication" o "Authentication Required", es porque tu deployment tiene activada la **Protección de Deployment** de Vercel.

## Solución: Desactivar la Protección de Deployment

### Pasos:

1. **Ir al Dashboard de Vercel**
   - Visita: https://vercel.com/dashboard
   - Inicia sesión con tu cuenta

2. **Seleccionar tu Proyecto**
   - Click en el proyecto: `api-hunterxhunter`
   - O busca: `api-hunterxhunter-cpa8sdex2-yuletzi-s-projects.vercel.app`

3. **Ir a Settings**
   - En el menú superior, click en **"Settings"**

4. **Deployment Protection**
   - En el menú lateral izquierdo, busca **"Deployment Protection"**
   - O navega directamente a: `Settings > Deployment Protection`

5. **Desactivar Protección**
   - Encontrarás una opción que dice algo como:
     - "Vercel Authentication" o "Password Protection" o "Protection Mode"
   - Cambia el modo a: **"None"** o **"Disabled"**
   - También puedes ver opciones como:
     - ✅ "Standard Protection" (puede requerir login de Vercel)
     - ✅ "Only Preview Deployments" 
     - ⭐ **"Disabled"** ← Selecciona esta
   
6. **Guardar Cambios**
   - Click en **"Save"** o **"Update"**

7. **Verificar**
   - Espera 1-2 minutos
   - Visita nuevamente: https://api-hunterxhunter-cpa8sdex2-yuletzi-s-projects.vercel.app/
   - Ahora deberías ver tu pantalla de login personalizada

## Alternativa: Hacer Público el Deployment

Si no encuentras "Deployment Protection", busca:

1. **Settings > General**
2. Busca algo como **"Production Branch"** o **"Deployment Protection"**
3. Asegúrate de que el deployment sea público

## Verificación Final

Una vez desactivada la protección, deberías ver:

✅ **Pantalla de Login** con:
- Campo de username
- Campo de password
- Credenciales de prueba mostradas:
  - Admin: `admin` / `admin123`
  - Usuario: `usuario1` / `user123`
- Botón "Iniciar Sesión"

❌ **NO deberías ver:**
- "Vercel Authentication"
- "Authentication Required"
- Redirección a vercel.com/sso-api

## Notas Importantes

- La protección de deployment de Vercel es diferente a tu sistema de autenticación de la app
- Vercel Protection: Protege el acceso a todo el deployment
- Tu App Auth: Sistema de login personalizado dentro de tu aplicación
- Para desarrollo y testing, es mejor desactivar la Vercel Protection
- Para producción, puedes usar Vercel Protection si necesitas restringir acceso adicional

## Configuración Actual de Vercel

**Build Command:** `npx expo export -p web`
**Output Directory:** `dist`
**Framework:** Expo (React Native Web)

**URL de Producción:** https://api-hunterxhunter-cpa8sdex2-yuletzi-s-projects.vercel.app/

## Credenciales de la Aplicación

Una vez que veas la pantalla de login, usa:

### Admin (Acceso Total - CRUD Completo)
- **Username:** `admin`
- **Password:** `admin123`
- Puede: Crear, Leer, Actualizar, Eliminar personajes y habilidades

### Usuario (Solo Lectura)
- **Username:** `usuario1`
- **Password:** `user123`
- Puede: Solo listar y ver personajes y habilidades
- Los botones de Crear/Editar/Eliminar estarán deshabilitados

## Soporte

Si después de desactivar la protección sigues viendo problemas:
1. Intenta hacer un nuevo deployment: `Settings > Deployments > Redeploy`
2. Limpia la caché del navegador: Ctrl + Shift + R
3. Verifica que el último commit esté desplegado en Vercel
