'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SidebarSearchField() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search articles..."
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 focus:ring-amber-500 focus:border-amber-500 text-sm"
      />
      <button 
        type="submit"
        className="p-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold transition-colors text-sm"
      >
        Search
      </button>
    </form>
  );
}
