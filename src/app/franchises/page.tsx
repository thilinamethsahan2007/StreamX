'use client';

import Navbar from '@/components/layout/Navbar';
import FranchiseCard from '@/components/franchise/FranchiseCard';
import FranchiseSearch from '@/components/franchise/FranchiseSearch';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Franchise, activeFranchises } from '@/lib/franchises';

export default function FranchisesPage() {
    const [customFranchises, setCustomFranchises] = useState<Franchise[]>([]);

    useEffect(() => {
        const fetchCustomFranchises = async () => {
            const { data, error } = await supabase
                .from('franchises')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) {
                setCustomFranchises(data.map(f => ({
                    id: f.id,
                    name: f.name,
                    description: f.description,
                    backdropPath: f.backdrop_path,
                    type: f.type,
                    value: f.value,
                    isCustom: true,
                    updatedAt: f.updated_at
                })));
            }
        };

        fetchCustomFranchises();
    }, []);

    const allFranchises = [...customFranchises, ...activeFranchises];

    return (
        <main className="min-h-screen bg-[#141414]">
            <Navbar />
            <div className="pt-24 pb-12 container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">Franchises</h1>

                    <FranchiseSearch franchises={allFranchises} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allFranchises.map((franchise) => (
                        <FranchiseCard key={franchise.id} franchise={franchise} />
                    ))}
                </div>
            </div>
        </main>
    );
}
