'use client';

import React, { useState, useEffect } from 'react';
import { Music, Plus, Trash2, Upload, CheckCircle2, ShieldAlert, Loader2, Save, FileDown } from 'lucide-react';

interface MidiPiece {
  id: string;
  title: string;
  composer: string;
  description: string;
  grade: number;
  genre: string;
  difficulty: string;
  fileUrl: string;
  fileSize: string;
  duration: string;
  compatSoftware: string[];
  educationalNote: string;
  isFeatured: boolean;
}

export default function AdminMidisCrud() {
  const [midis, setMidis] = useState<MidiPiece[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('5');
  const [genre, setGenre] = useState('Bolalar qo‘shig‘i');
  const [difficulty, setDifficulty] = useState('EASY');
  const [compatSoftware, setCompatSoftware] = useState('SeeMusic, Synthesia, Midiano');
  const [educationalNote, setEducationalNote] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
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
    fetchMidis();
  }, []);

  const fetchMidis = () => {
    setLoading(true);
    fetch('/api/midis')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMidis(data);
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
    formData.append('type', 'midis');

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
      setFormSuccess('Fayl serverga yuklandi! Nomi: ' + data.fileName);
    } catch (err: any) {
      setFormError(err.message || 'Fayl yuklashda xatolik yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !composer || !uploadedUrl) {
      setFormError('Sarlavha, kompozitor va MIDI fayl majburiy!');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const softwareArray = compatSoftware.split(',').map((s) => s.trim()).filter(Boolean);

    const newMidi = {
      title,
      composer,
      description,
      grade: parseInt(grade),
      genre,
      difficulty,
      fileUrl: uploadedUrl,
      fileSize: uploadedSize || '15 KB',
      duration: '02:30', // Default mock duration
      compatSoftware: softwareArray,
      educationalNote,
      isFeatured,
    };

    try {
      const response = await fetch('/api/midis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMidi),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Qo‘shish muvaffaqiyatsiz tugadi');
      }

      setFormSuccess('Yangi MIDI fayl muvaffaqiyatli qo‘shildi!');
      
      // Reset Form
      setTitle('');
      setComposer('');
      setDescription('');
      setUploadedUrl('');
      setUploadedSize('');
      setSelectedFile(null);
      setEducationalNote('');
      setIsFeatured(false);
      setShowAddForm(false);
      
      fetchMidis();
    } catch (err: any) {
      setFormError(err.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham ushbu MIDI asarini o‘chirib tashlamoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/midis/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('O‘chirish muvaffaqiyatsiz yakunlandi');
      }

      setMidis(midis.filter((m) => m.id !== id));
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
            MIDI Musiqalar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400">
            Darsliklardagi musiqiy asarlarni tahrirlash, yuklash va o‘chirish bo‘limi
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
          <span>{showAddForm ? 'Ro‘yxatga qaytish' : 'Yangi musiqiy asar'}</span>
        </button>
      </div>

      {/* CRUD Form */}
      {showAddForm ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-md space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-secondary" />
            <span>Yangi musiqiy asar qo‘shish shakli</span>
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

          {/* Form layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side: Upload file & check */}
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MIDI Fayl Yuklash</span>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".mid,.midi"
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

            {/* Right side: Metadata inputs */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Asar nomi *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kompozitor / Folklor *</label>
                  <input
                    type="text"
                    required
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Sinf *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
                  >
                    <option value="5">5-sinf</option>
                    <option value="6">6-sinf</option>
                    <option value="7">7-sinf</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Janr</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Qiyinchilik darajasi</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors cursor-pointer"
                  >
                    <option value="EASY">Oson</option>
                    <option value="MEDIUM">O‘rta</option>
                    <option value="HARD">Murakkab</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Asar tavsifi</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Metodik tavsiya (O‘qituvchilar uchun eslatma)</label>
                <textarea
                  rows={3}
                  value={educationalNote}
                  onChange={(e) => setEducationalNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Mos dasturlar (vergul bilan yozing)</label>
                  <input
                    type="text"
                    value={compatSoftware}
                    onChange={(e) => setCompatSoftware(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="featured" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Bosh sahifada ko‘rsatish (Tanlangan asar)
                  </label>
                </div>
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
                  <span>Ma’lumotlarni saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* MIDI List display */
        <div className="bg-white dark:bg-dark-card border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
            <Music className="w-4 h-4 text-secondary" />
            <span>Mavjud MIDI musiqiy asarlar ro‘yxati</span>
          </h3>

          {loading ? (
            <div className="text-center py-12 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              <span className="text-xs text-slate-400">Yuklanmoqda...</span>
            </div>
          ) : midis.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Hozircha hech qanday musiqiy asar qo‘shilmagan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3 pr-4">Nomi</th>
                    <th className="pb-3 pr-4">Kompozitor</th>
                    <th className="pb-3 pr-4">Sinf</th>
                    <th className="pb-3 pr-4">Janr</th>
                    <th className="pb-3 pr-4">Qiyinchilik</th>
                    <th className="pb-3 pr-4">Hajmi</th>
                    <th className="pb-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {midis.map((m) => (
                    <tr key={m.id} className="text-slate-600 dark:text-slate-300">
                      <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-100">{m.title}</td>
                      <td className="py-3 pr-4">{m.composer}</td>
                      <td className="py-3 pr-4 font-semibold">{m.grade}-sinf</td>
                      <td className="py-3 pr-4">{m.genre}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          m.difficulty === 'EASY' ? 'bg-emerald-500/10 text-emerald-600' :
                          m.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-rose-500/10 text-rose-600'
                        }`}>
                          {m.difficulty}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 text-[10px]">{m.fileSize}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(m.id)}
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
