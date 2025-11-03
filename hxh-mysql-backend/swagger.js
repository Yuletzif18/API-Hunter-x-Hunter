
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs Hunter x Hunter (microservicios)',
      version: '1.0.0',
      description: 'Documentación centralizada de microservicios: personajes y habilidades'
    },
    tags: [
      {
        name: 'personajes',
        description: 'Operaciones relacionadas con personajes',
        externalDocs: {
          description: 'Consultar API Personajes',
          url: 'http://localhost:3002/api/personajes'
        }
      },
      {
        name: 'habilidades',
        description: 'Operaciones relacionadas con habilidades',
        externalDocs: {
          description: 'Consultar API Habilidades',
          url: 'http://localhost:3003/api/habilidades'
        }
      }
    ],
    servers: [
      { url: 'http://localhost:3002', description: 'Microservicio Personajes (puerto 3002)' },
      { url: 'http://localhost:3003', description: 'Microservicio Habilidades (puerto 3003)' }
    ],
    components: {
      schemas: {
        Personaje: {
          type: 'object',
          required: ['nombre', 'edad', 'altura', 'peso', 'urlImagen'],
          properties: {
            nombre: { type: 'string', description: 'Nombre del personaje', example: 'Gon Freecss' },
            edad: { type: 'integer', description: 'Edad del personaje', example: 12 },
            altura: { type: 'integer', description: 'Altura en cm', example: 154 },
            peso: { type: 'integer', description: 'Peso en kg', example: 49 },
            urlImagen: { type: 'string', description: 'URL de la imagen', example: 'https://ejemplo.com/gon.jpg' },
            genero: { type: 'string', description: 'Género', example: 'Masculino' },
            descripcion: { type: 'string', description: 'Descripción', example: 'Protagonista de Hunter x Hunter.' },
            habilidad: { type: 'string', description: 'Habilidad principal', example: 'Jajanken' },
            origen: { type: 'string', description: 'Lugar de origen', example: 'Isla Ballena' }
          },
          example: {
            nombre: 'Gon Freecss',
            edad: 12,
            altura: 154,
            peso: 49,
            urlImagen: 'https://ejemplo.com/gon.jpg',
            genero: 'Masculino',
            descripcion: 'Protagonista de Hunter x Hunter.',
            habilidad: 'Jajanken',
            origen: 'Isla Ballena'
          }
        },
        Habilidad: {
          type: 'object',
          required: ['nombre', 'tipo', 'descripcion', 'personaje'],
          properties: {
            nombre: { type: 'string', description: 'Nombre de la habilidad', example: 'Jajanken' },
            tipo: { type: 'string', description: 'Tipo de habilidad', example: 'Nen' },
            descripcion: { type: 'string', description: 'Descripción de la habilidad', example: 'Técnica especial de Gon.' },
            personaje: { type: 'string', description: 'Nombre del personaje asociado', example: 'Gon Freecss' }
          },
          example: {
            nombre: 'Jajanken',
            tipo: 'Nen',
            descripcion: 'Técnica especial de Gon.',
            personaje: 'Gon Freecss'
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './routes/habilidad/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = { swaggerSpec, swaggerUi };

