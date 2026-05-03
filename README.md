# Case Técnico - Desenvolvedor(a) de Software

## Links
- **Frontend (Vercel):** https://todo-avante.vercel.app
- **Backend (Railway):** https://todo-avante-production.up.railway.app/api
- **Documentação da API (Swagger):** https://todo-avante-production.up.railway.app/api/docs
---
## Descrição

Um Aplicativo de lista de tarefas com suporte a múltiplas listas, cada uma contendo suas próprias tarefas.
A aplicação permite criar e gerenciar listas de tarefas organizadas, com controle de status, datas e descrições, integrando frontend e backend via API REST.
---

## Tecnologias utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express.js** 
- **Prisma ORM** 
- **PostgreSQL** 
- **Swagger** 

### Frontend
- **React** com **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**

### Infraestrutura
- **Railway**
- **Vercel**
---

## Funcionalidades

### Listas
- Criar nova lista com título e descrição
- Visualizar todas as listas criadas
- Editar título e descrição de uma lista
- Remover uma lista
- Contagem de tarefas por lista
- Data de criação exibida em cada lista

### Tarefas
- Criar tarefa vinculada a uma lista
- Visualizar todas as tarefas de uma lista
- Editar título, descrição, status e data de término
- Remover tarefa
- Alterar status diretamente com botão "Avançar →"
- Filtro de tarefas por status (Pendente / Em andamento / Concluída)
- Busca de tarefas por título
- Contagem de tarefas por status

---

## Como executar o projeto localmente

### Pré-requisitos
- Node.js 18+
- npm
- PostgreSQL instalado localmente (ou usar a DATABASE_URL do Railway)

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/` com:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/todo"
```

> Substitua com as credenciais do seu PostgreSQL local.

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

O backend estará disponível em: `http://localhost:3333`

A documentação da API estará disponível em: `http://localhost:3333/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

> Por padrão o frontend aponta para `http://localhost:3333/api`. Para usar o backend em produção localmente, crie um arquivo `.env` em `frontend/` com:
> ```
> VITE_API_URL=https://todo-avante-production.up.railway.app/api
> ```

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/lists | Listar todas as listas |
| GET | /api/lists/:id | Buscar lista por ID |
| POST | /api/lists | Criar nova lista |
| PUT | /api/lists/:id | Atualizar lista |
| DELETE | /api/lists/:id | Remover lista |
| GET | /api/tasks | Listar tarefas (aceita ?listId e ?status) |
| GET | /api/tasks/:id | Buscar tarefa por ID |
| POST | /api/tasks | Criar nova tarefa |
| PUT | /api/tasks/:id | Atualizar tarefa |
| DELETE | /api/tasks/:id | Remover tarefa |

> Documentação completa e interativa disponível em: https://todo-avante-production.up.railway.app/api/docs

---

## Decisões tomadas

### Relação entre listas e tarefas
Toda tarefa pertence obrigatoriamente a uma lista. A relação é 1:N significa que uma lista pode ter muitas tarefas, mas cada tarefa pertence a uma única lista. Isso é garantido tanto na validação do backend quanto na interface do frontend.

### O que acontece ao remover uma lista com tarefas?
Foi adotada a estratégia de **remoção em cascata**: ao remover uma lista, todas as suas tarefas são removidas automaticamente. Isso é definido no nível do banco de dados através da diretiva `onDelete: Cascade` no schema do Prisma, garantindo integridade dos dados sem necessidade de lógica extra na aplicação. O usuário é alertado com um diálogo de confirmação antes da ação ser executada.

### Armazenamento dos dados
Os dados são persistidos em um banco **PostgreSQL** hospedado no Railway. O Prisma ORM gerencia, garantindo que a estrutura do banco esteja sempre sincronizada com o código. Escolhi o no lugar do PostgreSQL em vez do SQLite para garantir que os dados persistam corretamente no ambiente de produção em nuvem.

### Separação em camadas
O backend foi organizado em camadas distintas — **routes**, **controllers** e **middlewares** — seguindo o princípio de responsabilidade única e facilitando a manutenção e expansão do código.

### Documentação da API
Foi utilizado Swagger (OpenAPI 3.0) para documentar todos os endpoints da API de forma interativa, permitindo visualizar e testar as rotas diretamente pelo browser.

---

## Observações

- Quebrei um pouco a cabeça para fazer a migração do SQLite para PostgreSQL pois exigiu recriar o histórico de migrations manualmente.
- O status foi armazenado como string no banco em vez de enum do PostgreSQL para facilitar futuras adições de novos status sem migrations e evitar novos erros.
- Pensei em deixar a organização em componentes reutilizáveis (`StatusBadge`, `TaskCard`, `ListCard`, `TaskForm`, `ListForm`), pois facilita a manutenção e escalabilidade do frontend.
