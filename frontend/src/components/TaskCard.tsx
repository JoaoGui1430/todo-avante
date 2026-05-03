import { Task, TaskStatus } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    PENDING: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
    COMPLETED: 'PENDING',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-800 text-sm ${task.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded transition"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded transition"
            title="Remover"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <div className="flex items-center gap-2">
          {task.endDate && (
            <span className="text-xs text-gray-400">
              📅 {new Date(task.endDate).toLocaleDateString('pt-BR')}
            </span>
          )}
          <button
            onClick={() => onStatusChange(task.id, nextStatus[task.status])}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition"
            title="Avançar status"
          >
            Avançar →
          </button>
        </div>
      </div>
    </div>
  );
}