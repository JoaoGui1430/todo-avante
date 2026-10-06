# Todo Avante — Gerenciador de listas e tarefas

Aplicação **fullstack** desenvolvida como case técnico, com **React e TypeScript** no frontend e **Node.js, Express, Prisma e PostgreSQL** no backend.

O sistema permite organizar tarefas em múltiplas listas, acompanhar seus status e realizar buscas. A interface se comunica com o backend por uma API REST documentada com Swagger/OpenAPI.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router e Axios |
| Backend | Node.js, TypeScript e Express |
| Persistência | PostgreSQL e Prisma ORM |
| Documentação da API | Swagger/OpenAPI |

## Funcionalidades

### Listas

- Criação, edição, listagem e exclusão de listas.
- Título e descrição para cada lista.
- Exibição da data de criação e da quantidade de tarefas.
- Exclusão em cascata das tarefas ao remover uma lista, com confirmação na interface.

### Tarefas

- Criação, edição, listagem e exclusão de tarefas vinculadas a uma lista.
- Título, descrição, status e data de término opcional.
- Alteração de status pelo botão **Avançar**.
- Filtro por status e busca por título na interface.
- Contagem de tarefas por status.

| Status na interface | Valor utilizado na API |
| --- | --- |
| Pendente | `PENDING` |
| Em andamento | `IN_PROGRESS` |
| Concluída | `COMPLETED` |

## Executar localmente

### Pré-requisitos

- Git.
- Node.js e npm. O Vite utilizado no frontend requer Node.js **20.19+ ou 22.12+**, conforme a [documentação de compatibilidade](https://vite.dev/guide/). Observe também eventuais requisitos adicionais informados pelo npm.
- PostgreSQL instalado e em execução.
- Um banco de dados chamado `todo`.

### 1. Clonar o repositório

```bash
git clone https://github.com/JoaoGui1430/todo-avante.git
cd todo-avante
```

### 2. Criar o banco de dados

Em um cliente PostgreSQL, como pgAdmin ou psql, execute:

```sql
CREATE DATABASE todo;
```

Se o banco já existir, esta etapa pode ser ignorada.

### 3. Configurar o backend

Na raiz do projeto:

```bash
cd backend
npm install
npm install dotenv
```

O pacote `dotenv` é utilizado pelo arquivo `prisma.config.ts` para carregar as variáveis de ambiente.

Crie o arquivo `backend/.env`:

```dotenv
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/todo?schema=public"
```

Substitua `postgres` e `SUA_SENHA` pelo usuário e pela senha do seu PostgreSQL. Ajuste a porta ou o nome do banco se necessário.

Ainda na pasta `backend`, gere o cliente Prisma, aplique as migrations existentes e inicie o servidor:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

- **API:** [http://localhost:3333/api](http://localhost:3333/api)
- **Swagger:** [http://localhost:3333/api/docs](http://localhost:3333/api/docs)

Mantenha esse terminal aberto enquanto utiliza a aplicação.

### 4. Configurar o frontend

Em outro terminal, na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

Por padrão, o frontend utiliza `http://localhost:3333/api`. Para definir outro endereço, crie o arquivo `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3333/api
```

Se alterar essa variável com o frontend em execução, reinicie o servidor de desenvolvimento.

## Experimentar a aplicação

Com frontend e backend em execução:

1. Crie uma lista, como **Estudos**.
2. Abra a lista e cadastre algumas tarefas.
3. Edite uma tarefa e altere seu status.
4. Utilize a busca por título e os filtros por status.
5. Recarregue a página para conferir a persistência dos dados.
6. Exclua a lista e observe a confirmação de remoção das tarefas associadas.

## Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/lists` | Listar listas com contagem de tarefas |
| GET | `/api/lists/:id` | Buscar uma lista e suas tarefas |
| POST | `/api/lists` | Criar uma lista |
| PUT | `/api/lists/:id` | Atualizar uma lista |
| DELETE | `/api/lists/:id` | Excluir uma lista e suas tarefas |
| GET | `/api/tasks` | Listar tarefas, com filtros opcionais por `listId` e `status` |
| GET | `/api/tasks/:id` | Buscar uma tarefa |
| POST | `/api/tasks` | Criar uma tarefa vinculada a uma lista |
| PUT | `/api/tasks/:id` | Atualizar uma tarefa |
| DELETE | `/api/tasks/:id` | Excluir uma tarefa |

Exemplo de consulta com filtros:

```http
GET /api/tasks?listId=ID_DA_LISTA&status=PENDING
```

Os campos das requisições e respostas estão descritos no Swagger disponível durante a execução local.

## Organização do código

| Diretório | Responsabilidade |
| --- | --- |
| `backend/prisma` | Modelagem do banco de dados e migrations |
| `backend/src/routes` | Definição das rotas da API |
| `backend/src/controllers` | Tratamento das requisições, validações e acesso aos dados |
| `backend/src/middlewares` | Tratamento centralizado de erros |
| `frontend/src/pages` | Páginas de listas e detalhes das tarefas |
| `frontend/src/components` | Componentes de interface e formulários |
| `frontend/src/services` | Comunicação com a API |
| `frontend/src/types` | Tipos utilizados pelo frontend |

## Decisões de implementação

### Relacionamento entre listas e tarefas

Foi adotada uma relação **1:N**: uma lista pode conter várias tarefas, e cada tarefa pertence a uma única lista. O relacionamento é definido no schema do Prisma, e o backend verifica a existência da lista ao cadastrar uma tarefa.

### Exclusão em cascata

A relação utiliza `onDelete: Cascade`. Dessa forma, a exclusão de uma lista remove também suas tarefas no banco de dados. Antes da operação, a interface solicita confirmação ao usuário.

### Persistência com PostgreSQL

O projeto passou de SQLite para PostgreSQL durante seu desenvolvimento. A escolha permitiu utilizar um banco externo ao processo da aplicação e preparar a persistência para um ambiente de hospedagem.

O Prisma é utilizado para acesso aos dados, definição do schema e versionamento das alterações do banco por migrations. Na execução local, os dados são armazenados na instância PostgreSQL configurada em `DATABASE_URL`.

### Validação dos status

Os status são armazenados como strings e validados no backend a partir de uma lista de valores permitidos. Essa abordagem evita a necessidade de alterar um enum no banco ao adicionar um status; mudanças futuras também exigem atualizar as validações e a interface.

### Separação de responsabilidades

O backend separa rotas, controllers e middlewares. No frontend, componentes como `StatusBadge`, `TaskCard`, `ListCard`, `TaskForm` e `ListForm` são reutilizados para organizar a interface e reduzir repetição.

### Documentação com Swagger

A API utiliza OpenAPI 3.0 e Swagger UI para documentar endpoints e permitir chamadas interativas durante a execução local.

## Aprendizados

- Integração de uma interface React com uma API REST em TypeScript.
- Modelagem de relacionamentos e exclusão em cascata com Prisma.
- Migração de SQLite para PostgreSQL e reorganização das migrations.
- Implementação de filtros, busca e atualização de status na interface.
- Organização de componentes reutilizáveis e documentação dos endpoints.

## Autor

**João Guilherme Gadelha Abreu de Souza**

[GitHub](https://github.com/JoaoGui1430) · [LinkedIn](https://www.linkedin.com/in/joaoguilhermegadelha/)
