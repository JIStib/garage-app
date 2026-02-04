import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import reparationService from "../../services/reparationService";
import type { Reparation } from "../../types";
import { TimeIcon } from "../../icons";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ReparationList() {
    const queryClient = useQueryClient();

    // 1. LECTURE : Chargement automatique et mise en cache
    const {
        data: reparations = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['reparations'],
        queryFn: async () => {
            const data = await reparationService.getAll();
            // Gestion du wrapper Laravel .data
            const items = (data as any).data || data;
            return Array.isArray(items) ? items : [];
        }
    });

    // 2. MUTATION : Suppression
    const deleteMutation = useMutation({
        mutationFn: (id: string) => reparationService.delete(id),
        onSuccess: () => {
            // Force le rafraîchissement de la liste
            queryClient.invalidateQueries({ queryKey: ['reparations'] });
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        },
        onError: (err) => {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    });

    // 3. MUTATION : Synchronisation Firebase
    const syncMutation = useMutation({
        mutationFn: () => reparationService.syncToFirebase(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reparations'] });
        }
    });

    // --- State pour les Modales ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Reparation | null>(null);

    // --- Handlers ---
    const handleSync = () => syncMutation.mutate();

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete.id);
            // deleteMutation.mutate(Number(itemToDelete.id));
        }
    };

    return (
        <>
            <PageMeta
                title="Réparations"
                description="Gestion des réparations"
            />
            <PageBreadcrumb pageTitle="Réparations" />

            <div className="space-y-6">
                <ComponentCard
                    title="Liste des réparations"
                    headerRight={
                        <div className="flex gap-2">
                            <button
                                disabled={syncMutation.isPending}
                                onClick={handleSync}
                                // className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 disabled:bg-brand-400 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                            >
                                {syncMutation.isPending ?
                                    (<>
                                        <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Traitement...
                                    </>) :
                                    (<>
                                        <TimeIcon />
                                        Synchroniser
                                    </>)}
                            </button>
                        </div>
                    }
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isError ? (
                        <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                            {isError}
                        </div>
                    ) : reparations.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            Aucune réparation trouvée, essayez de faire une synchronisation.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <div className="max-w-full overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                ID
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Utilisateur firebase
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Créé le
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Details
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Statut
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {reparations.map((reparation: Reparation) => (
                                            <TableRow key={reparation.id}>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.id}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.id_utilisateur_firebase}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {new Date(reparation.status_history[0].date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.details.length} trucs à réparer
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.status_history.length > 0 && reparation.status_history.reduce((latest, current) =>
                                                        new Date(current.date) > new Date(latest.date) ? current : latest
                                                    ).statut.nom}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/reparations/${reparation.id}`}>
                                                            <button
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 5l7 7-7 7"
                                                                    />
                                                                </svg>
                                                                {/* Voir */}
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </ComponentCard>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la réparation"
                // message={`Supprimer "${itemToDelete?.nom}" ?`}
                // confirmText="Valider"
                isLoading={deleteMutation.isPending}
            />
        </>
    );
}
