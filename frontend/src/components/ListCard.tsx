import { List } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  list: List;
  onEdit: (list: List) => void;
  onDelete: (id: string) => void;
}

export default function ListCard({ list, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  const count = list._count?.tasks ?? 0;

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/lists/${list.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-800 text-base leading-tight">{list.title}</h2>
        <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(list)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded transition"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(list.id)}
            className="text-gray-400 hover:text-red-600 p-1 rounded transition"
            title="Remover"
          >
            🗑️
          </button>
        </div>
      </div>

      {list.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{list.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(list.createdAt).toLocaleDateString('pt-BR')}
        </span>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {count} {count === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </div>
    </div>
  );
}