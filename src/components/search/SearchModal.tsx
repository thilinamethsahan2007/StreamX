'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchMovies } from '@/hooks/useSearch';
import { getImageUrl } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const { data: results, isLoading } = useSearchMovies(query);
    const openModal = useModalStore((state) => state.openModal);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleItemClick = (item: any) => {
        openModal(item);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-[#141414] border-b border-gray-800 px-4 py-6 md:px-16"
                    >
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <Search className="h-6 w-6 text-gray-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search for movies and TV shows..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-white text-xl outline-none placeholder:text-gray-500"
                                />
                                <button onClick={onClose} className="text-gray-400 hover:text-white">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {query && (
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {isLoading && (
                                        <div className="text-gray-400 text-center py-8">Searching...</div>
                                    )}

                                    {!isLoading && results && results.length === 0 && (
                                        <div className="text-gray-400 text-center py-8">No results found</div>
                                    )}

                                    {!isLoading && results && results.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {results.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleItemClick(item)}
                                                    className="cursor-pointer group"
                                                >
                                                    <img
                                                        src={getImageUrl(item.poster_path || item.backdrop_path, 'w500')}
                                                        alt={item.title || item.name}
                                                        className="w-full rounded-md group-hover:scale-105 transition"
                                                    />
                                                    <p className="mt-2 text-sm text-gray-300 line-clamp-1">
                                                        {item.title || item.name}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
