import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Genre {
    id: number;
    name: string;
}

interface GenreDropdownProps {
    genres: Genre[];
    selectedGenre: Genre | null;
    onSelect: (genre: Genre | null) => void;
}

export default function GenreDropdown({ genres, selectedGenre, onSelect }: GenreDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-1.5 bg-black border border-white/30 hover:border-white text-white text-sm font-medium rounded transition-colors"
            >
                {selectedGenre ? selectedGenre.name : 'Genres'}
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 max-h-96 overflow-y-auto bg-black/90 border border-white/20 rounded shadow-xl z-50 backdrop-blur-sm">
                    <div className="grid grid-cols-1 p-2 gap-1">
                        <button
                            onClick={() => {
                                onSelect(null);
                                setIsOpen(false);
                            }}
                            className={`text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${!selectedGenre ? 'text-white font-bold bg-white/10' : 'text-gray-300'
                                }`}
                        >
                            All Genres
                        </button>
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => {
                                    onSelect(genre);
                                    setIsOpen(false);
                                }}
                                className={`text-left px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${selectedGenre?.id === genre.id ? 'text-white font-bold bg-white/10' : 'text-gray-300'
                                    }`}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
