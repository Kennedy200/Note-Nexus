import React, { useState, useEffect } from 'react';
import { ShoppingBag, Download, Calendar, ExternalLink } from 'lucide-react';

interface Purchase {
  id: number;
  note: {
    id: number;
    title: string;
    course_code: string;
    thumbnail: string;
    file_url: string;
  };
  amount_paid: number;
  purchased_at: string;
}

const MyPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  useEffect(() => {
    fetch(`http://localhost:8000/api/purchases/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setPurchases(data);
        setLoading(false);
      });
  }, []);

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount_paid, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">🛍️ My Purchases</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">
          {purchases.length} notes purchased • {totalSpent} NC spent
        </p>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-20 font-bold">Loading...</p>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-bold mb-4">No purchases yet</p>
            <a 
              href="/dashboard/browse"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase hover:bg-blue-700 transition-all"
            >
              Browse Notes
            </a>
          </div>
        ) : (
          purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-6">
                <img 
                  src={purchase.note.thumbnail} 
                  alt={purchase.note.title}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{purchase.note.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-blue-50 rounded-lg text-xs font-black text-blue-600 uppercase">
                      {purchase.note.course_code}
                    </span>
                    
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="font-bold">
                        {new Date(purchase.purchased_at).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="font-black text-amber-600">
                      {purchase.amount_paid} NC
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.open(purchase.note.file_url, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase hover:bg-blue-600 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPurchases;