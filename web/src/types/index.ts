export interface User {
    id: number;
    nom: string;
    email: string;
    // Add other fields as necessary based on API response
}

export interface Role {
    id: number;
    nom: string;
}

export interface TypeReparation {
    id: number;
    nom: string;
    duree: number;
    prix: number;
}

export interface Utilisateur {
    id: number;
    identifiant: string;
    id_utilisateur_role: number;
}

export interface ReparationDetail {
    id: number;
    id_reparation: string;
    id_type_reparation: number;
    est_termine: boolean;
    type_reparation: TypeReparation;
}

export interface Statut {
    id: number,
    nom: string
}

export interface StatusHistory {
    id: number;
    id_reparation: string;
    id_reparation_statut: number;
    date: Date;
    statut: Statut;
}

export interface Reparation {
    id: string;
    id_utilisateur_firebase: string;
    // id_firebase: string;
    // utilisateur: Utilisateur;
    details: ReparationDetail[];
    status_history: StatusHistory[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// interface PaginatedResponse<T> {
//     data: T[];
//     current_page: number;
//     last_page: number;
//     total: number;
//     per_page: number;
// }