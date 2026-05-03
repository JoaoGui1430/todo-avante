import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, Task, TaskStatus } from '../types';
import { getListById, createTask, updateTask, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import StatusBadge from '../components/StatusBadge';

const STATUS_FILTERS: Array<{ label: string; value: TaskStatus | 'ALL' }> = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Em andamento', value: 'IN_PROGRESS' },
  { label: 'Concluída', value: 'COMPLETED' },
];

export default function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [list, setList] = useState<(List & { tasks: Task[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  async function fetchList() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getListById(id);
      setList(data);
    } catch {
      alert('Lista não encontrada');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchList(); }, [id]);

  const filteredTasks = (list?.tasks ?? []).filter(t => {
    const matchesStatus = filter === 'ALL' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  async function handleCreateTask(data: Parameters<typeof createTask>[0]) {
    setSaving(true);
    try {
      await createTask(data);
      setShowForm(false);
      fetchList();
    } catch {
      alert('Erro ao criar tarefa');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTask(data: Parameters<typeof createTask>[0]) {
    if (!editingTask) return;
    setSaving(true);
    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      fetchList();
    } catch {
      alert('Erro ao atualizar tarefa');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm('Remover esta tarefa?')) return;
    try {
      await deleteTask(taskId);
      fetchList();
    } catch {
      alert('Erro ao remover tarefa');
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    try {
      await updateTask(taskId, { status });
      fetchList();
    } catch {
      alert('Erro ao atualizar status');
    }
  }

  if (loading) return <div className="text-center text-gray-400 py-20">Carregando...</div>;
  if (!list) return null;

  const counts = {
    PENDING: list.tasks.filter(t => t.status === 'PENDING').length,
    IN_PROGRESS: list.tasks.filter(t => t.status === 'IN_PROGRESS').length,
    COMPLETED: list.tasks.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <button
        onClick={() => navigate('/')}
        className="text-sm text-blue-600 hover:underline mb-4 block"
      >
        ← Voltar para listas
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
        {list.description && (
          <p className="text-sm text-gray-500 mt-1">{list.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Criada em {new Date(list.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {(Object.entries(counts) as [TaskStatus, number][]).map(([s, n]) => (
          <div key={s} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <StatusBadge status={s} />
            <span className="text-sm font-medium text-gray-700">{n}</span>
          </div>
        ))}
      </div>

      {/* Filters + search + new task */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar tarefa..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTask(null); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
        >
          + Nova tarefa
        </button>
      </div>

      {/* Modal form */}
      {(showForm || editingTask) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingTask ? 'Editar tarefa' : 'Nova tarefa'}
            </h2>
            <TaskForm
              listId={list.id}
              initial={editingTask ?? undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-4xl mb-4">✅</p>
          <p className="text-sm">Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={t => { setEditingTask(t); setShowForm(false); }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}