'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Upload, CheckCircle2, ShieldAlert, Loader2, Save } from 'lucide-react';

interface PdfDoc {
  id: string;
  title: string;
  description: string;
  grade: number | null;
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
}

export default function AdminPdfsCrud() {
  const [pdfs, setPdfs] = useState<PdfDoc[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('');
  
  // File Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedSize, setUploadedSize] = useState('');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = () => {
    setLoading(true);
    fetch('/api/pdfs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPdfs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', 'pdfs');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'File upload failed');
      }

      setUploadedUrl(data.fileUrl);
      setUploadedSize(data.fileSize);
      setFormSuccess('Hujjat serverga yuklandi! Nomi: ' + data.fileName);
    } catch (err: any) {
      setFormError(err.message || 'Fayl yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !uploadedUrl) {
      setFormError('Sarlavha va PDF fayl yuklash majburiy!');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const newPdf = {
      title,
      description,
      grade: grade ? parseInt(grade) : null,
      fileUrl: uploadedUrl,
      fileSize: uploadedSize || '1.0 MB',
    };

    try {
      const response = await fetch('/api/pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPdf),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Saqlash muvaffaqiyatsiz tugadi');
      }

      setFormSuccess('Yangi PDF hujjat muvaffaqiyatli qo‘shildi!');
      
      // Reset Form
      setTitle('');
      setDescription('');
      setGrade('');
      setUploadedUrl('');
      setUploadedSize('');
      setSelectedFile(null);
      setShowAddForm(false);
      
      fetchPdfs();
    } catch (err: any) {
      setFormError(err.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham ushbu PDF hujjatni o‘chirib tashlamoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/pdfs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('O‘chirish muvaffaqiyatsiz yakunlandi');
      }

      setPdfs(pdfs.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white font-display">
            PDF Hujjatlar & Notalar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400">
            Darsliklar, notalar va metodik qo‘llanmalarni yuklash va tahrirlash bo‘limi
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormError(null);
            setFormSuccess(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-sky-500 shadow-md cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Ro‘yxatga qaytish' : 'Yangi PDF hujjat'}</span>
        </button>
      </div>

      {/* Form content */}
      {showAddForm ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-md space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-secondary" />
            <span>Yangi PDF hujjat qo‘shish shakli</span>
          </h3>

          {formError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Upload Section */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PDF Fayl Yuklash</span>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-sky-500/10 file:text-sky-500 file:cursor-pointer hover:file:bg-sky-500/20"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={uploading}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-sky-400 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Serverga yuklash</span>
                    </button>
                  )}
                </div>

                {uploadedUrl && (
                  <div className="pt-2 text-[10px] text-emerald-500 font-semibold break-all">
                    Yuklandi: {uploadedUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Right form metadata inputs */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Hujjat nomi / Sarlavha *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Tegishli sinf (tanlash ixtiyoriy)</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
                  >
                    <option value="">Sinfga bog‘lamaslik</option>
                    <option value="5">5-sinf</option>
                    <option value="6">6-sinf</option>
                    <option value="7">7-sinf</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Hujjat tavsifi</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:shadow-sky-500/20 cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Hujjatni saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* PDF List display */
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-secondary" />
            <span>Mavjud PDF darsliklar va metodik qo‘llanmalar ro‘yxati</span>
          </h3>

          {loading ? (
            <div className="text-center py-12 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              <span className="text-xs text-slate-400">Yuklanmoqda...</span>
            </div>
          ) : pdfs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Hozircha hech qanday PDF hujjat yuklanmagan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3 pr-4">Hujjat nomi</th>
                    <th className="pb-3 pr-4">Bog‘langan sinf</th>
                    <th className="pb-3 pr-4">Fayl hajmi</th>
                    <th className="pb-3 pr-4">Yuklab olingan</th>
                    <th className="pb-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pdfs.map((p) => (
                    <tr key={p.id} className="text-slate-600 dark:text-slate-300">
                      <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-100">{p.title}</td>
                      <td className="py-3 pr-4 font-semibold">{p.grade ? `${p.grade}-sinf` : 'Umumiy'}</td>
                      <td className="py-3 pr-4 text-slate-400 text-[10px]">{p.fileSize}</td>
                      <td className="py-3 pr-4 font-bold text-slate-700 dark:text-slate-300">{p.downloadCount} marta</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg border border-rose-100 dark:border-rose-900/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
