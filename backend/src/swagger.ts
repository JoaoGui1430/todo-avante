import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do List API',
      version: '1.0.0',
      description: 'API para o gerenciamento de listas e tarefas',
    },
    servers: [
      {
        url: 'https://todo-avante-production.up.railway.app/api',
        description: 'Na nuvem',
      },
      {
        url: 'http://localhost:3333/api',
        description: 'Local',
      },
    ],
    components: {
      schemas: {
        List: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx1234abc' },
            title: { type: 'string', example: 'Estudos' },
            description: { type: 'string', example: 'Tarefas de estudo' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx5678def' },
            title: { type: 'string', example: 'Revisar banco de dados' },
            description: { type: 'string', example: 'Estudar joins e índices' },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
              example: 'PENDING',
            },
            createdAt: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            listId: { type: 'string', example: 'clx1234abc' },
          },
        },
      },
    },
    paths: {
      '/lists': {
        get: {
          tags: ['Listas'],
          summary: 'Listar todas as listas',
          responses: {
            200: {
              description: 'Lista de listas retornada com sucesso',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/List' } },
                },
              },
            },
          },
        },
        post: {
          tags: ['Listas'],
          summary: 'Criar nova lista',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'Estudos' },
                    description: { type: 'string', example: 'Minhas tarefas de estudo' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Lista criada com sucesso' },
            400: { description: 'Título obrigatório' },
          },
        },
      },
      '/lists/{id}': {
        get: {
          tags: ['Listas'],
          summary: 'Buscar lista por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Lista encontrada' },
            404: { description: 'Lista não encontrada' },
          },
        },
        put: {
          tags: ['Listas'],
          summary: 'Atualizar lista',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Lista atualizada' },
            404: { description: 'Lista não encontrada' },
          },
        },
        delete: {
          tags: ['Listas'],
          summary: 'Remover lista e suas tarefas',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Lista removida com sucesso' },
            404: { description: 'Lista não encontrada' },
          },
        },
      },
      '/tasks': {
        get: {
          tags: ['Tarefas'],
          summary: 'Listar tarefas',
          parameters: [
            { name: 'listId', in: 'query', schema: { type: 'string' }, description: 'Filtrar por lista' },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
              description: 'Filtrar por status',
            },
          ],
          responses: {
            200: {
              description: 'Tarefas retornadas com sucesso',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                },
              },
            },
          },
        },
        post: {
          tags: ['Tarefas'],
          summary: 'Criar nova tarefa',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'listId'],
                  properties: {
                    title: { type: 'string', example: 'Revisar banco de dados' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
                    endDate: { type: 'string', format: 'date-time', nullable: true },
                    listId: { type: 'string', example: 'clx1234abc' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tarefa criada com sucesso' },
            400: { description: 'Título ou listId obrigatório' },
            404: { description: 'Lista não encontrada' },
          },
        },
      },
      '/tasks/{id}': {
        get: {
          tags: ['Tarefas'],
          summary: 'Buscar tarefa por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Tarefa encontrada' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
        put: {
          tags: ['Tarefas'],
          summary: 'Atualizar tarefa',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
                    endDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Tarefa atualizada' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
        delete: {
          tags: ['Tarefas'],
          summary: 'Remover tarefa',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Tarefa removida com sucesso' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);