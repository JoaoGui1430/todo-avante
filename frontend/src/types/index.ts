export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface List {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  endDate: string | null;
  listId: string;
  list?: { id: string; title: string };
}