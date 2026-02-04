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
import typeReparationService from "../../services/typeReparationService";
import type { TypeReparation } from "../../types";
import TypeReparationForm from "./TypeReparationForm";
import { PlusIcon, TimeIcon } from "../../icons";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function TypeReparationList() {
    const queryClient = useQueryClient();

    // 1. LECTURE : Remplacer useEffect + loadTypeReparations
    const {
        data: typeReparations = [],
        isLoading,
        isError } = useQuery({
            queryKey: ['types-reparation'],
            queryFn: async () => {
                const data = await typeReparationService.getAll();
                const items = (data as any).data || data;
                return Array.isArray(items) ? items : [];
            },
            staleTime: 1000 * 60 * 5, // Cache de 5 minutes
        });

    // 2. MUTATION : Création/Édition
    const saveMutation = useMutation({
        mutationFn: (data: Omit<TypeReparation, "id"> | TypeReparation) => {
            return 'id' in data
                ? typeReparationService.update(data.id, data)
                : typeReparationService.create(data);
        },
        onSuccess: () => {
            // Invalider le cache pour forcer le rafraîchissement
            queryClient.invalidateQueries({ queryKey: ['types-reparation'] });
            setIsModalOpen(false);
        }
    });

    // 3. MUTATION : Suppression
    const deleteMutation = useMutation({
        mutationFn: (id: number) => typeReparationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['types-reparation'] });
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        },
        onError: (err: any) => {
            alert("Erreur lors de la suppression");
            console.error(err);
        }
    });

    // 4. MUTATION : Synchronisation Firebase
    const syncMutation = useMutation({
        mutationFn: () => typeReparationService.syncToFirebase(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['types-reparation'] });
        }
    });

    // --- State pour les Modales (inchangé) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTypeReparation, setSelectedTypeReparation] = useState<TypeReparation | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TypeReparation | null>(null);

    // --- Handlers simplifiés ---
    const handleSync = () => syncMutation.mutate();

    const handleCreate = () => {
        setSelectedTypeReparation(null);
        setIsModalOpen(true);
    };

    const handleEdit = (typeReparation: TypeReparation) => {
        setSelectedTypeReparation(typeReparation);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Omit<TypeReparation, "id"> | TypeReparation) => {
        saveMutation.mutate(data);
    };

    const openDeleteModal = (item: TypeReparation) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) deleteMutation.mutate(itemToDelete.id);
    };



    return (
        <>
            <PageMeta
                title="Types de Réparation"
                description="Gestion des types de réparation"
            />
            <PageBreadcrumb pageTitle="Types de réparation" />

            <div className="space-y-6">
                <ComponentCard
                    title="Liste des types de réparation"
                    headerRight={
                        <div className="flex gap-2">
                            <button
                                disabled={syncMutation.isPending}
                                onClick={handleSync}
                                // className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 disabled:bg-brand-400 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 "
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
                            <button
                                disabled={saveMutation.isPending && !selectedTypeReparation?.id}
                                onClick={handleCreate}
                                // className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 disabled:bg-brand-400 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                            >
                                {saveMutation.isPending && !selectedTypeReparation?.id ?
                                    (<>
                                        <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Traitement...
                                    </>) :
                                    (<>
                                        <PlusIcon />
                                        Nouveau
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
                            Erreur lors du chargement des types de réparation
                        </div>
                    ) : typeReparations.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            Aucun type de réparation trouvé
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
                                                Nom
                                            </TableCell>
                                            {/* <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Créé le
                                            </TableCell> */}
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Durée
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                Prix
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
                                        {typeReparations.map((typeReparation) => (
                                            <TableRow key={typeReparation.id}>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {typeReparation.id}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {typeReparation.nom}
                                                </TableCell>
                                                {/* <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {new Date().toLocaleDateString()}
                                                </TableCell> */}
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {typeReparation.duree} secondes
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {typeReparation.prix} Ar
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            disabled={saveMutation.isPending && selectedTypeReparation?.id === typeReparation.id}
                                                            onClick={() => handleEdit(typeReparation)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100 disabled:bg-blue-200 disabled:text-blue-400 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:disabled:bg-blue-900/40"
                                                        >
                                                            {saveMutation.isPending && selectedTypeReparation?.id === typeReparation.id ?
                                                                (<>
                                                                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-600 rounded-full animate-spin" />
                                                                </>) :
                                                                (<svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>)}
                                                        </button>
                                                        <button
                                                            disabled={deleteMutation.isPending && itemToDelete?.id === typeReparation.id}
                                                            onClick={() => openDeleteModal(typeReparation)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100 disabled:bg-red-200 disabled:text-red-400 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:disabled:bg-red-900/40"
                                                        >
                                                            {deleteMutation.isPending && itemToDelete?.id === typeReparation.id ?
                                                                (<>
                                                                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-600 rounded-full animate-spin" />
                                                                </>) :
                                                                (<svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>)}
                                                        </button>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell className="px-5 py-4 text-end">
                                                    <div className="relative inline-block">
                                                        <button
                                                            className="dropdown-toggle"
                                                            onClick={() => toggleDropdown(typeReparation.id)}
                                                        >
                                                            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                                                        </button>
                                                        <Dropdown
                                                            isOpen={openDropdownId === typeReparation.id}
                                                            onClose={closeDropdown}
                                                            className="w-40 p-2"
                                                        >
                                                            <DropdownItem
                                                                onItemClick={() => {
                                                                    handleEdit(typeReparation);
                                                                    closeDropdown();
                                                                }}
                                                                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                                            >
                                                                Modifier
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onItemClick={() => {
                                                                    openDeleteModal(typeReparation);
                                                                }}
                                                                className="flex w-full font-normal text-left text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                                            >
                                                                Supprimer
                                                            </DropdownItem>
                                                        </Dropdown>
                                                    </div>
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </ComponentCard>
            </div>

            <TypeReparationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={selectedTypeReparation}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer le type de réparation"
                // message={`Supprimer "${itemToDelete?.nom}" ?`}
                // confirmText="Valider"
                isLoading={deleteMutation.isPending}
            />
        </>
    );
}
