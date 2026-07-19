import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Coins, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const getAvatarColor = (name: string) => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500'];
  return colors[name.charCodeAt(0) % colors.length];
};

const LeaderboardPreview: React.FC = () => {
  const [topCoins, setTopCoins] = useState<any[]>([]);
  const [topNotes, setTopNotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'coins' | 'notes'>('coins');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/leaderboard/coins').then(r => r.json()),
      fetch('http://localhost:8000/api/leaderboard/notes').then(r => r.json())
    ]).then(([coins, notes]) => {
      setTopCoins(coins.slice(0, 3));
      setTopNotes(notes.slice(0, 3));
    }).catch(() => {});
  }, []);

  const list = activeTab === 'coins' ? topCoins : topNotes;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section id="leaderboard" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 text-yellow-700 px-5 py-2.5 rounded-full text-sm font-black mb-6">
            <Trophy className="w-4 h-4" />
            Weekly Leaderboard
          </div>
          <h2 className="text-4xl md:text-5xl font-[1000] text-gray-900 tracking-tight mb-4">
            Top Students This Week
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            Rankings reset every Monday. Can you claim the top spot?
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              activeTab === 'coins'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <Coins className="w-4 h-4" /> Most NoteCoins
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              activeTab === 'notes'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Most Notes
          </button>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-3 mb-8">
          {list.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
              <Trophy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">Be the first on the leaderboard!</p>
            </div>
          ) : (
            list.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all ${
                  index === 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'
                }`}
              >
                <span className="text-3xl">{medals[index]}</span>
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(user.full_name)} flex items-center justify-center text-white font-black text-lg shadow`}>
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900">{user.full_name}</p>
                  <p className="text-xs font-bold text-gray-400">
                    {activeTab === 'coins'
                      ? `${user.total_uploads} notes uploaded`
                      : `${user.total_downloads || 0} total downloads`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${index === 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
                    {activeTab === 'coins' ? `${user.coin_balance} NC` : `${user.total_uploads} notes`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
          >
            <Crown className="w-4 h-4" />
            Join & Compete
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreview;