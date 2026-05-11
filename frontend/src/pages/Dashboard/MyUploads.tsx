import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Eye, Coins, Calendar, Download } from 'lucide-react';

interface Note {
  id: number;
  title: string;
  course_code: string;
  department: string;
  level: string;
  price: number;
  rating: number;
  download_count: number;
  created_at: string;
  thumbnail: string;
}

const MyUploads: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  useEffect(() => {
    fetch(`http://localhost:8000/api/notes/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setLoading(false);
      });
  }, []);

  const totalDownloads = notes.reduce((sum, note) => sum + note.download_count, 0);
  const totalEarnings = notes.reduce((sum, note) => sum + (note.download_count * note.price * 0.7), 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">📚 My Uploads</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">{notes.length} notes shared</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <FileText className="w-10 h-10 text-blue-500 mb-4" />
          <p className="text-4xl font-black text-gray-900 mb-1">{notes.length}</p>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Total Uploads</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <Download className="w-10 h-10 text-purple-500 mb-4" />
          <p className="text-4xl font-black text-gray-900 mb-1">{totalDownloads}</p>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Total Downloads</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
          <p className="text-4xl font-black text-gray-900 mb-1">{Math.floor(totalEarnings)}</p>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Estimated Earnings (NC)</p>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-20 font-bold">Loading...</p>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-bold mb-4">No uploads yet</p>
            <a 
              href="/dashboard/upload"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase hover:bg-blue-700 transition-all"
            >
              Upload Your First Note
            </a>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-start gap-6">
                <img 
                  src={note.thumbnail} 
                  alt={note.title}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1">{note.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-50 rounded-lg text-xs font-black text-blue-600 uppercase">
                          {note.course_code}
                        </span>
                        <span className="text-sm text-gray-500 font-bold">{note.department}</span>
                        <span className="text-sm text-gray-500 font-bold">{note.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-bold text-sm">{note.download_count} downloads</span>
                    </div>

                    <div className="flex items-center gap-2 text-amber-600">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold text-sm">{note.price === 0 ? 'Free' : `${note.price} NC`}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="font-bold text-sm">
                        {new Date(note.created_at).toLocaleDateString('en-NG')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyUploads;