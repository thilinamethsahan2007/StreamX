'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ChevronRight } from 'lucide-react';
import { Franchise } from '@/lib/franchises';
import { cn } from '@/lib/utils';

interface FranchiseSearchProps {
    franchises: (Franchise & { isCustom?: boolean })[];
}

export default function FranchiseSearch({ franchises }: FranchiseSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<(Franchise & { isCustom?: boolean })[]>([]);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = franchises.filter(f =>
            f.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions

        setSuggestions(filtered);
    }, [query, franchises]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim()) return;

        setIsOpen(false);
        // If exact match found in suggestions, go there
        const exactMatch = suggestions.find(s => s.name.toLowerCase() === query.toLowerCase());
        if (exactMatch) {
            handleSelect(exactMatch);
        } else {
            // Otherwise, go to search page (which triggers AI)
            router.push(`/franchises/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSelect = (franchise: Franchise & { isCustom?: boolean }) => {
        setQuery(franchise.name);
        setIsOpen(false);
        if (franchise.isCustom) {
            router.push(`/franchises/search?q=${encodeURIComponent(franchise.name)}`);
        } else {
            router.push(`/franchises/${franchise.id}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full md:w-[500px] group">
            <div className="relative">
                <div className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 blur-lg",
                    isOpen ? "opacity-75" : "opacity-0"
                )}></div>
                <form onSubmit={handleSearch} className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search or create with AI..."
                        className="w-full bg-white/10 backdrop-blur-md text-white pl-12 pr-4 py-4 rounded-full border border-white/10 focus:border-white/20 focus:outline-none focus:ring-0 placeholder-gray-400 shadow-xl transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                    {query && (
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 text-white" />
                        </button>
                    )}
                </form>
            </div>

            {/* Dropdown */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {suggestions.length > 0 && (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Existing Franchises
                            </div>
                            {suggestions.map((franchise) => (
                                <button
                                    key={franchise.id}
                                    onClick={() => handleSelect(franchise)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group/item transition-colors"
                                >
                                    <span className="text-gray-200 group-hover/item:text-white">{franchise.name}</span>
                                    {franchise.isCustom && (
                                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">AI Generated</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-gray-800 p-2">
                        <button
                            onClick={() => handleSearch()}
                            className="w-full text-left px-4 py-3 bg-gradient-to-r from-red-900/20 to-purple-900/20 hover:from-red-900/40 hover:to-purple-900/40 rounded-xl flex items-center gap-3 group/ai transition-all"
                        >
                            <div className="p-2 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg group-hover/ai:scale-110 transition-transform">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Create "{query}"</p>
                                <p className="text-xs text-gray-400">Generate a new timeline with AI</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
