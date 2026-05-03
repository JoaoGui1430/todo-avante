import { TaskStatus } from '../types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  },
  IN_PROGRESS: {
    label: 'Em andamento',
    className: 'bg-blue-100 text-blue-800 border border-blue-300',
  },
  COMPLETED: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800 border border-green-300',
  },
};

interface Props {
  status: TaskStatus;
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}