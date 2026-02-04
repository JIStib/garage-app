import api from './api';
import type { StatsJournalier, StatsJournalierFormData, StatsMontantTotal } from '../types';

const RESOURCE = '/stats';

const interventionsStatsService = {
    getMontantTotalInterventionsCreees: async (): Promise<StatsMontantTotal> => {
        const response = await api.get<StatsMontantTotal>(RESOURCE + '/montant-total-interventions-creees');
        return response.data;
    },

    getMontantTotalInterventionsPayees: async (): Promise<StatsMontantTotal> => {
        const response = await api.get<StatsMontantTotal>(RESOURCE + '/montant-total-interventions-payees');
        return response.data;
    },

    getStatsInterventionsParJour: async (data: StatsJournalierFormData): Promise<StatsJournalier> => {
        const response = await api.post<StatsJournalier>(RESOURCE + '/stats-journalier', data);
        return response.data;
    },
};

export default interventionsStatsService;
