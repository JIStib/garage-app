import api from './api';
import type { Role } from '../types';

const RESOURCE = '/utilisateur-roles';

const roleService = {
    getAll: async (): Promise<Role[]> => {
        const response = await api.get<Role[]>(RESOURCE);
        return response.data;
    },

    getById: async (id: number): Promise<Role> => {
        const response = await api.get<Role>(`${RESOURCE}/${id}`);
        return response.data;
    },

    create: async (data: Omit<Role, 'id'>): Promise<Role> => {
        const response = await api.post<Role>(RESOURCE, data);
        return response.data;
    },

    update: async (id: number, data: Partial<Role>): Promise<Role> => {
        const response = await api.put<Role>(`${RESOURCE}/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${RESOURCE}/${id}`);
    }
};

export default roleService;
