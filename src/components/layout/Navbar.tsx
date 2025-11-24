'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import SearchModal from '@/components/search/SearchModal';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 z-50 w-full px-4 py-3 md:px-16 md:py-4 transition-colors duration-300',
                    isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e50914]">
                            STREAMX
                        </Link>

                        {/* Navigation - Movies & TV Shows always visible, Home & New only on desktop */}
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                            <Link href="/" className="hidden md:block text-sm font-medium hover:text-gray-300 transition">
                                Home
                            </Link>
                            <Link href="/tv" className="text-xs sm:text-sm font-medium hover:text-gray-300 transition">
                                TV Shows
                            </Link>
                            <Link href="/movies" className="text-xs sm:text-sm font-medium hover:text-gray-300 transition">
                                Movies
                            </Link>
                            <Link href="/new" className="hidden md:block text-sm font-medium hover:text-gray-300 transition">
                                New & Popular
                            </Link>
                        </div>
                    </div>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                </div>
            </nav>

            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
