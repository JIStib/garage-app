import { useEffect, useState } from "react";
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
import type { Reparation, ReparationDetail, StatusHistory } from "../../types";
import { TimeIcon } from "../../icons";
import { Link, useParams } from "react-router";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router"; // Import de useNavigate pour redirection après suppression

export default function ReparationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. LECTURE : Se recharge automatiquement si 'id' change dans l'URL
    const {
        data: reparation = null,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['reparations', id], // L'ID ici rend la requête dynamique
        queryFn: async () => {
            if (!id) return null;
            const data = await reparationService.getById(id);
            const item: Reparation = (data as any).data || data;
            return item || null;
        },
        enabled: !!id, // Ne lance la requête que si l'ID existe
    });

    // 2. MUTATION : Suppression
    const deleteMutation = useMutation({
        mutationFn: (repairId: string) => reparationService.delete(repairId),
        onSuccess: () => {
            // Invalider la liste globale car une réparation a disparu
            queryClient.invalidateQueries({ queryKey: ['reparations'] });
            setIsDeleteModalOpen(false);
            // Rediriger l'utilisateur vers la liste après suppression
            navigate('/reparations');
        },
        onError: (err) => {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    });

    // --- State pour les Modales ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReparation, setSelectedReparation] = useState<Reparation | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Reparation | null>(null);

    // --- Handlers ---
    const openDeleteModal = (item: Reparation) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteMutation.mutate(itemToDelete.id);
            // deleteMutation.mutate(Number(itemToDelete.id));
        }
    };

    return (
        <>
            <PageMeta
                title={`Réparation ${!isLoading ? reparation?.id : ""}`}
                description={`Réparation ${!isLoading ? reparation?.id : ""}`}
            />
            <PageBreadcrumb previousText="Réparations" previousTo="/reparations" pageTitle={`Réparation ${!isLoading ? reparation?.id : ""}`} />


            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                <div className="space-y-6">
                    <ComponentCard
                        title={`Réparation ${!isLoading ? reparation?.id : ""}`}
                    // headerRight={
                    //     <button
                    //         onClick={handleCreate}
                    //         className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    //     >
                    //         <TimeIcon />
                    //         Synchroniser
                    //     </button>
                    // }
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : isError ? (
                            <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                                {isError}
                            </div>
                        ) : reparation === null ? (
                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                Aucune réparation trouvée
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
                                                    {/* {typeReparation.prix}Ar */}
                                                    {/* Créé */}
                                                    {reparation.status_history.length > 0 && reparation.status_history.reduce((latest: StatusHistory, current: StatusHistory) =>
                                                        new Date(current.date) > new Date(latest.date) ? current : latest
                                                    ).statut.nom}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/reparations/${reparation.id}`}>
                                                            <button
                                                                // onClick={() => handleEdit(typeReparation)}
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
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                                Finir
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </ComponentCard>
                </div>

                <div className="space-y-6">
                    <ComponentCard
                        title="Détails"
                    // headerRight={
                    //     <button
                    //         onClick={handleCreate}
                    //         className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    //     >
                    //         <TimeIcon />
                    //         Synchroniser
                    //     </button>
                    // }
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : isError ? (
                            <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                                {isError}
                            </div>
                        ) : reparation?.details.length === 0 ? (
                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                Aucun détail trouvé
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
                                                    Type
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Prix
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
                                            {reparation?.details.map((detail: ReparationDetail) => (
                                                <TableRow key={detail.id}>
                                                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                        {detail.id}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                        {detail.type_reparation.nom}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                        {detail.type_reparation.prix}Ar
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                        {detail.est_termine ? "Terminé" : "Créé"}
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">
                                                        <Link to={`/reparations/${reparation.id}`}>
                                                            <button
                                                                // onClick={() => handleEdit(typeReparation)}
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
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                                Finir
                                                            </button>
                                                        </Link>
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
            </div>

            {/* <TypeReparationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={selectedReparation}
            /> */}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la réparation"
            // message={`Supprimer "${itemToDelete?.nom}" ?`}
            // confirmText="Valider"
            // isLoading={isDeleting}
            />
        </>
    );
}
