import { create } from 'zustand';
import { Movie, MovieDetails } from 'tmdb-ts';

interface ModalState {
    isOpen: boolean;
    movie: Movie | MovieDetails | null;
    openModal: (movie: Movie | MovieDetails) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    movie: null,
    openModal: (movie) => set({ isOpen: true, movie }),
    closeModal: () => set({ isOpen: false, movie: null }),
}));
