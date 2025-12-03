import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Franchise } from '@/lib/franchises';

interface CustomFranchise extends Franchise {
    isCustom: true;
}

interface FranchiseState {
    customFranchises: CustomFranchise[];
    addFranchise: (franchise: CustomFranchise) => void;
    removeFranchise: (id: string) => void;
}

export const useFranchiseStore = create<FranchiseState>()(
    persist(
        (set) => ({
            customFranchises: [],
            addFranchise: (franchise) =>
                set((state) => {
                    if (state.customFranchises.some((f) => f.id === franchise.id)) {
                        return state;
                    }
                    return { customFranchises: [...state.customFranchises, franchise] };
                }),
            removeFranchise: (id) =>
                set((state) => ({
                    customFranchises: state.customFranchises.filter((f) => f.id !== id),
                })),
        }),
        {
            name: 'streamx-franchises',
        }
    )
);
