import React, { useState } from 'react';
import { Upload, FileText, Coins, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const UploadNote: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_code: '',
    department: '',
    level: '100L',
    price: 0
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showToast('error', 'No file selected', 'Please select a PDF file to upload');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File too large', 'Maximum file size is 10MB');
      return;
    }

    setUploading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('course_code', formData.course_code);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('level', formData.level);
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('user_id', user.id.toString());
    formDataToSend.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/notes/upload', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Note uploaded successfully!', `You earned ${data.coins_earned} NC! New balance: ${data.new_balance} NC`);
        
        // Update user balance in localStorage
        const updatedUser = { ...user, coin_balance: data.new_balance };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          course_code: '',
          department: '',
          level: '100L',
          price: 0
        });
        setFile(null);
        
        setTimeout(() => {
          window.location.href = '/dashboard/my-uploads';
        }, 2000);
      } else {
        showToast('error', 'Upload failed', data.detail || 'Please try again');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">📤 Upload Note</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">Share knowledge, earn NoteCoins</p>
      </div>

      {/* Reward Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[3rem] p-8 text-white">
        <div className="flex items-center gap-4">
          <Coins className="w-12 h-12" />
          <div>
            <h3 className="text-2xl font-black mb-1">Earn 5 NC Per Upload!</h3>
            <p className="font-bold opacity-90">Plus 70% commission on all sales of your notes</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Note Title *</label>
          <input 
            type="text"
            required
            placeholder="e.g., Advanced Data Structures Complete Notes"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Description *</label>
          <textarea 
            required
            rows={4}
            placeholder="Describe what this note covers..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold resize-none"
          />
        </div>

        {/* Course Code & Department */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Course Code *</label>
            <input 
              type="text"
              required
              placeholder="e.g., CSC 301"
              value={formData.course_code}
              onChange={(e) => setFormData({...formData, course_code: e.target.value.toUpperCase()})}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Department *</label>
            <select 
              required
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Law">Law</option>
              <option value="Mass Comm">Mass Communication</option>
              <option value="Business">Business Administration</option>
              <option value="Accounting">Accounting</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Engineering">Engineering</option>
              <option value="Economics">Economics</option>
            </select>
          </div>
        </div>

        {/* Level & Price */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Level *</label>
            <select 
              required
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
            >
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Price (NoteCoins) *</label>
            <input 
              type="number"
              required
              min={0}
              max={50}
              placeholder="0 = Free"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold text-lg"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2 uppercase">Upload PDF File *</label>
          <div className="relative">
            <input 
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="flex items-center justify-center gap-4 w-full px-6 py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-all"
            >
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-black text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="font-black text-gray-900">Click to upload PDF</p>
                    <p className="text-sm text-gray-500 font-bold">Max file size: 10MB</p>
                  </div>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={uploading}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              Upload Note & Earn 5 NC
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 font-bold">
          By uploading, you agree to our content guidelines and terms of service
        </p>
      </form>
    </div>
  );
};

export default UploadNote;