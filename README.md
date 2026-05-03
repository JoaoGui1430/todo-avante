# Case Técnico da Avante Tech Jr - Desenvolvedor(a) de Software

## Descrição
Um Aplicativo de lista de tarefas com suporte a múltiplas listas,
cada uma contendo suas próprias tarefas.

## Tecnologias utilizadas

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Funcionalidades

### Listas
- Criar, listar, editar e remover listas
- Visualizar contagem de tarefas por lista
- Dados: título, descrição, data de criação

### Tarefas
- Criar, listar, editar e remover tarefas dentro de uma lista
- Alterar status diretamente (Avançar →) ou via edição
- Filtro por status (Pendente / Em andamento / Concluída)
- Busca por título
- Dados: título, descrição, status, data de criação, data de término

## Como executar o projeto

### Pré-requisitos
- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

O backend estará disponível em: `http://localhost:3333`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## Algumas das minhas decisões que fiz no projeto: 

### Relação entre listas e tarefas
Toda tarefa pertence obrigatoriamente a uma lista. A relação é de 1:N onde
uma lista pode ter muitas tarefas, mas uma tarefa pertence a uma única lista.

### O que acontece ao remover uma lista com tarefas?
Adotei a estratégia de remoção em cascata: ao remover uma lista,
todas as suas tarefas são removidas automaticamente. Isso é definido no
nível do banco de dados com `onDelete: Cascade` lá no schema Prisma.
O usuário é alertado com um diálogo de confirmação antes da ação.

### Armazenamento dos dados
Os dados são persistidos em um banco de dados PostgreSQL através do
Prisma ORM. O arquivo `dev.db` é gerado automaticamente na pasta `backend/prisma/`.

## Observações
- O filtro de tarefas e busca por título foram implementados no frontend
  como funcionalidades opcionais diferenciais.