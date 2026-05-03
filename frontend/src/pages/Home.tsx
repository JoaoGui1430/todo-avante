import { useEffect, useState } from 'react';
import { List } from '../types';
import { getLists, createList, updateList, deleteList } from '../services/api';
import ListCard from '../components/ListCard';
import ListForm from '../components/ListForm';

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);
  const [saving, setSaving] = useState(false);

  async function fetchLists() {
    setLoading(true);
    try {
      const data = await getLists();
      setLists(data);
    } catch {
      alert('Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLists();
  }, []);

  async function handleCreate(data: { title: string; description: string }) {
    setSaving(true);
    try {
      await createList(data);
      setShowForm(false);
      fetchLists();
    } catch {
      alert('Erro ao criar lista');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(data: { title: string; description: string }) {
    if (!editingList) return;
    setSaving(true);
    try {
      await updateList(editingList.id, data);
      setEditingList(null);
      fetchLists();
    } catch {
      alert('Erro ao atualizar lista');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover esta lista e todas as suas tarefas?')) return;
    try {
      await deleteList(id);
      fetchLists();
    } catch {
      alert('Erro ao remover lista');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Listas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {lists.length} {lists.length === 1 ? 'lista' : 'listas'} criadas
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingList(null); }}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          + Nova lista
        </button>
      </div>

      {/* Modal form */}
      {(showForm || editingList) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingList ? 'Editar lista' : 'Nova lista'}
            </h2>
            <ListForm
              initial={editingList ?? undefined}
              onSubmit={editingList ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditingList(null); }}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center text-gray-400 py-20">Carregando...</div>
      ) : lists.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-sm">Nenhuma lista criada ainda.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-blue-600 text-sm underline"
          >
            Criar primeira lista
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(list => (
            <ListCard
              key={list.id}
              list={list}
              onEdit={l => { setEditingList(l); setShowForm(false); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}