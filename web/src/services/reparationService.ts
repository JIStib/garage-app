import api from './api';
import type { Reparation } from '../types';

const RESOURCE = '/reparations';

const reparationService = {
    getAll: async (): Promise<Reparation[]> => {
        const response = await api.get<Reparation[]>(RESOURCE);
        return response.data;
    },
    
    // // On ajoute un paramètre page (par défaut 1)
    // getAll: async (page: number = 1): Promise<PaginatedResponse<Reparation>> => {
    //     const response = await api.get<PaginatedResponse<Reparation>>(`${RESOURCE}?page=${page}`);
    //     return response.data;
    // },

    getById: async (id: string): Promise<Reparation> => {
        const response = await api.get<Reparation>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: Omit<Reparation, 'id'>): Promise<Reparation> => {
        const response = await api.post<Reparation>(RESOURCE, data);
        return response.data;
    },

    update: async (id: string, data: Partial<Reparation>): Promise<Reparation> => {
        const response = await api.put<Reparation>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    },

    syncToFirebase: async (): Promise<void> => {
        await api.get(`${RESOURCE}/sync`);
    }
};

export default reparationService;
