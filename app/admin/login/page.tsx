'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldAlert, Loader2, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-8 space-y-6 glow-primary">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mx-auto shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">
            {t.adminDash.loginTitle}
          </h2>
          <p className="text-xs text-slate-400">
            Aesthetic IT-Music Education Portal
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {/* Username */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {t.adminDash.username}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {t.adminDash.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-secondary transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{t.adminDash.loginBtn}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center border-t border-slate-100 dark:border-slate-800 pt-4">
          <span className="text-[10px] text-slate-400">
            TDPU Musiqa Ta’limi Kafedrasi Tadqiqot Loyihasi
          </span>
        </div>

      </div>
    </div>
  );
}
