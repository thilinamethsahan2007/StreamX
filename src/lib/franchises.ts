export interface Franchise {
    id: string;
    name: string;
    description: string;
    backdropPath: string; // Using a known movie backdrop
    type: 'keyword' | 'company';
    value: number;
    updatedAt?: string;
    content?: any[]; // JSON content
}

export const franchises: Franchise[] = [];

export const activeFranchises = franchises;
