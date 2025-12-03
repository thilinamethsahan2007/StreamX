'use client';

import { useEffect, useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchModal from '@/components/search/SearchModal';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isFranchisePage = pathname?.startsWith('/franchises');

    const links = [
        { name: 'Home', href: '/' },
        { name: 'TV Shows', href: '/tv' },
        { name: 'Movies', href: '/movies' },
        { name: 'Franchises', href: '/franchises' },
        { name: 'Social', href: '/social' },
        { name: 'My List', href: '/my-list' },

    ];

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 z-50 w-full px-4 py-4 md:px-12 transition-all duration-500',
                    isScrolled || mobileMenuOpen ? 'glass border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 -ml-2 text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>

                        <Link href="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
                            StreamX
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1 md:gap-2">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-3 py-1.5 text-sm font-medium rounded-full transition-all",
                                        pathname === link.href
                                            ? "bg-white/10 text-white"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isFranchisePage && (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        )}

                        {user ? (
                            <Link
                                href="/account"
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white hover:scale-105 transition-transform"
                            >
                                {user.username.charAt(0).toUpperCase()}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-[#141414] border-b border-white/10 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
                        <div className="flex flex-col p-4 space-y-2">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-4 py-3 text-lg font-medium rounded-xl transition-all",
                                        pathname === link.href
                                            ? "bg-white/10 text-white"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
