import api from './api';
import type { Utilisateur } from '../types';

const RESOURCE = '/login';

const utilisateurLoginService = {
    login: async (data: Utilisateur): Promise<Utilisateur> => {
        const response = await api.post<Utilisateur>(RESOURCE, data);
        return response.data;
    },
};

export default utilisateurLoginService;
