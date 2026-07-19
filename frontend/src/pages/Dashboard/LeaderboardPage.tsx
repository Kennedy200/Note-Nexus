import React, { useState, useEffect } from 'react';
import { Trophy, Coins, BookOpen, Download, TrendingUp, Crown, Medal, Award } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  id: number;
  full_name: string;
  coin_balance: number;
  total_uploads: number;
  total_purchases: number;
  total_earned: number;
  total_downloads?: number;
  total_earned_from_sales?: number;
  joined: string;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 h-6 flex items-center justify-center font-black text-gray-400 text-sm">#{rank}</span>;
};

const getRankBg = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
  if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
  if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
  return 'bg-white border-gray-100';
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-orange-500', 'bg-teal-500'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coins' | 'notes'>('coins');
  const [coinsLeaderboard, setCoinsLeaderboard] = useState<LeaderboardUser[]>([]);
  const [notesLeaderboard, setNotesLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated] = useState(() => {
    // Calculate next Monday from now
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (8 - now.getDay()) % 7 || 7);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  });

  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const [coinsRes, notesRes] = await Promise.all([
        fetch('http://localhost:8000/api/leaderboard/coins'),
        fetch('http://localhost:8000/api/leaderboard/notes')
      ]);
      const coinsData = await coinsRes.json();
      const notesData = await notesRes.json();
      setCoinsLeaderboard(coinsData);
      setNotesLeaderboard(notesData);
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'coins' ? coinsLeaderboard : notesLeaderboard;
  const top3 = currentList.slice(0, 3);
  const rest = currentList.slice(3);

  const userRankCoins = coinsLeaderboard.find(u => u.id === user.id);
  const userRankNotes = notesLeaderboard.find(u => u.id === user.id);

  const daysUntilReset = () => {
    const now = new Date();
    const diff = lastUpdated.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Leaderboard
          </h2>
          <p className="text-gray-500 font-bold italic underline decoration-blue-200 mt-1">
            Top students on NoteNexus this week
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Resets In</p>
          <p className="text-2xl font-black text-blue-600">{daysUntilReset()} days</p>
          <p className="text-xs text-blue-400 font-bold">Every Monday</p>
        </div>
      </div>

      {/* Your Rank Card */}
      {(userRankCoins || userRankNotes) && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] p-6 text-white">
          <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-3">Your Rankings</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="text-xs font-black uppercase tracking-widest opacity-80">NoteCoins</span>
              </div>
              <p className="text-3xl font-black">
                {userRankCoins ? `#${userRankCoins.rank}` : 'Unranked'}
              </p>
              <p className="text-sm opacity-70 font-bold">
                {userRankCoins ? `${userRankCoins.coin_balance} NC` : 'Earn more coins!'}
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-green-300" />
                <span className="text-xs font-black uppercase tracking-widest opacity-80">Top Uploader</span>
              </div>
              <p className="text-3xl font-black">
                {userRankNotes ? `#${userRankNotes.rank}` : 'Unranked'}
              </p>
              <p className="text-sm opacity-70 font-bold">
                {userRankNotes ? `${userRankNotes.total_uploads} notes` : 'Upload more notes!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('coins')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
            activeTab === 'coins'
              ? 'bg-gray-900 text-white shadow-xl'
              : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'
          }`}
        >
          <Coins className="w-4 h-4" />
          NoteCoins
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
            activeTab === 'notes'
              ? 'bg-gray-900 text-white shadow-xl'
              : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Top Uploaders
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-black text-xl">No data yet</p>
          <p className="text-gray-300 font-bold mt-2">Be the first on the leaderboard!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center pt-8">
                <div className={`w-14 h-14 rounded-full ${getAvatarColor(top3[1]?.full_name || '')} flex items-center justify-center text-white font-black text-xl mb-3 shadow-lg`}>
                  {top3[1]?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-2xl w-full py-6 px-3 text-center border border-gray-200">
                  <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-black text-gray-900 text-sm truncate">{top3[1]?.full_name?.split(' ')[0]}</p>
                  <p className="text-xs font-bold text-gray-500 mt-1">
                    {activeTab === 'coins'
                      ? `${top3[1]?.coin_balance} NC`
                      : `${top3[1]?.total_uploads} notes`}
                  </p>
                  <div className="mt-2 bg-gray-300 text-gray-700 rounded-lg px-2 py-0.5 text-xs font-black">#2</div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full ${getAvatarColor(top3[0]?.full_name || '')} flex items-center justify-center text-white font-black text-2xl mb-3 shadow-2xl ring-4 ring-yellow-400`}>
                    {top3[0]?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <Crown className="w-7 h-7 text-yellow-500 absolute -top-4 left-1/2 -translate-x-1/2" />
                </div>
                <div className="bg-gradient-to-b from-yellow-50 to-amber-100 rounded-t-2xl w-full py-8 px-3 text-center border border-yellow-200 shadow-lg">
                  <p className="font-black text-gray-900 truncate">{top3[0]?.full_name?.split(' ')[0]}</p>
                  <p className="text-sm font-bold text-amber-700 mt-1">
                    {activeTab === 'coins'
                      ? `${top3[0]?.coin_balance} NC`
                      : `${top3[0]?.total_uploads} notes`}
                  </p>
                  <div className="mt-2 bg-yellow-400 text-yellow-900 rounded-lg px-2 py-0.5 text-xs font-black">#1</div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center pt-12">
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(top3[2]?.full_name || '')} flex items-center justify-center text-white font-black text-lg mb-3 shadow-lg`}>
                  {top3[2]?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-t-2xl w-full py-5 px-3 text-center border border-amber-200">
                  <Award className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                  <p className="font-black text-gray-900 text-sm truncate">{top3[2]?.full_name?.split(' ')[0]}</p>
                  <p className="text-xs font-bold text-amber-700 mt-1">
                    {activeTab === 'coins'
                      ? `${top3[2]?.coin_balance} NC`
                      : `${top3[2]?.total_uploads} notes`}
                  </p>
                  <div className="mt-2 bg-amber-300 text-amber-900 rounded-lg px-2 py-0.5 text-xs font-black">#3</div>
                </div>
              </div>
            </div>
          )}

          {/* Full List (4th and below) */}
          <div className="space-y-3">
            {/* Also show top 3 in list if podium shown, else show all */}
            {(top3.length < 3 ? currentList : rest).map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-md ${getRankBg(entry.rank)} ${entry.id === user.id ? 'ring-2 ring-blue-400' : ''}`}
              >
                {/* Rank */}
                <div className="w-8 flex-shrink-0 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full ${getAvatarColor(entry.full_name)} flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md`}>
                  {entry.full_name?.charAt(0).toUpperCase()}
                </div>

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 truncate">{entry.full_name}</p>
                    {entry.id === user.id && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-black rounded-full">YOU</span>
                    )}
                  </div>
                  {activeTab === 'coins' ? (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-gray-500">{entry.total_uploads} notes</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold text-gray-500">{entry.total_purchases} purchases</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {entry.total_downloads} downloads
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-bold text-green-600">+{entry.total_earned_from_sales} NC earned</span>
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  {activeTab === 'coins' ? (
                    <>
                      <p className="text-xl font-black text-blue-600">{entry.coin_balance}</p>
                      <p className="text-xs font-bold text-gray-400">NoteCoins</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-black text-green-600">{entry.total_uploads}</p>
                      <p className="text-xs font-bold text-gray-400">Notes</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer Note */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-500">
          🏆 Leaderboard resets every <span className="text-gray-900 font-black">Monday at midnight</span>.
          Upload more notes and earn NoteCoins to climb the ranks!
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;