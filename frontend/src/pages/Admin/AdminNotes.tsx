import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Search, BookOpen } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  course_code: string;
  department: string;
  level: string;
  price: number;
  rating: number;
  download_count: number;
  is_approved: boolean;
  uploader_name: string;
  uploader_email: string;
  created_at: string;
  thumbnail: string;
}

const AdminNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = () => {
    fetch('http://localhost:8000/api/admin/notes')
      .then(res => res.json())
      .then(data => { setNotes(data); setLoading(false); });
  };

  const approveNote = async (id: number) => {
    await fetch(`http://localhost:8000/api/admin/notes/${id}/approve`, { method: 'PUT' });
    fetchNotes();
  };

  const rejectNote = async (id: number) => {
    await fetch(`http://localhost:8000/api/admin/notes/${id}/reject`, { method: 'PUT' });
    fetchNotes();
  };

  const deleteNote = async (id: number) => {
    if (!confirm('Delete this note permanently?')) return;
    await fetch(`http://localhost:8000/api/admin/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
  };

  const filtered = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.course_code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || (filter === 'APPROVED' && n.is_approved) || (filter === 'PENDING' && !n.is_approved);
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Notes</h1>
          <p className="text-gray-400 font-bold mt-1">{notes.length} total notes</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white font-black rounded-2xl px-5 py-3 outline-none"
          >
            <option value="ALL">All Notes</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white font-bold outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((note) => (
          <div key={note.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6">
            <img src={note.thumbnail} alt={note.title} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-black rounded-lg">{note.course_code}</span>
                <span className={`px-3 py-1 text-xs font-black rounded-lg ${note.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {note.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <h3 className="text-white font-black truncate">{note.title}</h3>
              <p className="text-gray-400 text-sm font-bold">By {note.uploader_name} • {note.price === 0 ? 'FREE' : `${note.price} NC`} • ⭐ {note.rating} • {note.download_count} downloads</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!note.is_approved ? (
                <button onClick={() => approveNote(note.id)} className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-black text-sm hover:bg-green-500/30 transition-all">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              ) : (
                <button onClick={() => rejectNote(note.id)} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl font-black text-sm hover:bg-amber-500/30 transition-all">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              )}
              <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-red-400">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotes;