import api from './api';
import type { TypeReparation } from '../types';

const RESOURCE = '/types-reparation';

const typeReparationService = {
    getAll: async (): Promise<TypeReparation[]> => {
        const response = await api.get<TypeReparation[]>(RESOURCE);
        return response.data;
    },

    // // On ajoute un paramètre page (par défaut 1)
    // getAll: async (page: number = 1): Promise<PaginatedResponse<TypeReparation>> => {
    //     const response = await api.get<PaginatedResponse<TypeReparation>>(`${RESOURCE}?page=${page}`);
    //     return response.data;
    // },

    getById: async (id: number): Promise<TypeReparation> => {
        const response = await api.get<TypeReparation>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: Omit<TypeReparation, 'id'>): Promise<TypeReparation> => {
        const response = await api.post<TypeReparation>(RESOURCE, data);
        return response.data;
    },

    update: async (id: number, data: Partial<TypeReparation>): Promise<TypeReparation> => {
        const response = await api.put<TypeReparation>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    },

    syncToFirebase: async ():Promise<void> => {
        await api.get(`${RESOURCE}/sync`);
    }
};

export default typeReparationService;
