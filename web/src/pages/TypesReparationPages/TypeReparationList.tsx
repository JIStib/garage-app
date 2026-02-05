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
import typeReparationService from "../../services/typeReparationService";
import type { TypeReparation } from "../../types";
import TypeReparationForm from "./TypeReparationForm";
import { MoreDotIcon, PlusIcon, TimeIcon } from "../../icons";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

export default function TypeReparationList() {
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTypeReparation, setSelectedTypeReparation] =
        useState<TypeReparation | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<TypeReparation | null>(null);

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const [rowLoadingId, setRowLoadingId] = useState<number | null>(null);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    /* ===================== QUERY ===================== */

    const {
        data: typeReparations = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["types-reparation"],
        queryFn: async () => {
            const res = await typeReparationService.getAll();
            return (res as any).data ?? res;
        },
        staleTime: 1000 * 60 * 5,
    });

    /* ===================== MUTATIONS ===================== */

    const saveMutation = useMutation({
        mutationFn: (data: Omit<TypeReparation, "id"> | TypeReparation) => {
            if ("id" in data) {
                setRowLoadingId(data.id);
                return typeReparationService.update(data.id, data);
            }
            return typeReparationService.create(data);
        },
        onSuccess: (_res, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ["types-reparation"] });

            const id = variables?.id ?? null;
            if (id) setHighlightedId(id);

            setTimeout(() => setHighlightedId(null), 2500);
            setRowLoadingId(null);
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => {
            setRowLoadingId(id);
            return typeReparationService.delete(id);
        },
        onSuccess: (_res, id) => {
            queryClient.invalidateQueries({ queryKey: ["types-reparation"] });

            setHighlightedId(id);
            setTimeout(() => setHighlightedId(null), 2500);

            setRowLoadingId(null);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        },
    });

    const syncMutation = useMutation({
        mutationFn: () => typeReparationService.syncToFirebase(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types-reparation"] });
        },
    });

    /* ===================== HANDLERS ===================== */

    const handleCreate = () => {
        setSelectedTypeReparation(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: TypeReparation) => {
        setSelectedTypeReparation(item);
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

    const toggleDropdown = (id: number) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const closeDropdown = () => setOpenDropdownId(null);

    /* ===================== RENDER ===================== */

    return (
        <>
            <PageMeta
                title="Types de Réparation"
                description="Gestion des types de réparation"
            />
            <PageBreadcrumb pageTitle="Types de réparation" />

            <ComponentCard
                title="Liste des types de réparation"
                headerRight={
                    <div className="flex gap-2">
                            <button
                                disabled={syncMutation.isPending}
                                onClick={() => syncMutation.mutate()}
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
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="p-4 text-red-600">Erreur de chargement</div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nom</TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Durée</TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Prix</TableCell>
                                        <TableCell
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {typeReparations.map((item: TypeReparation) => {
                                        const isLoadingRow = rowLoadingId === item.id;
                                        const isHighlighted = highlightedId === item.id;

                                        return (
                                            <TableRow
                                                key={item.id}
                                                className={`transition-colors ${isHighlighted
                                                    ? "bg-gray-100 dark:bg-white/[0.06]"
                                                    : ""
                                                    }`}
                                            >
                                                <TableCell
                                                    className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{item.id}</TableCell>
                                                <TableCell
                                                    className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{item.nom}</TableCell>
                                                <TableCell
                                                    className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {item.duree} secondes
                                                </TableCell>
                                                <TableCell
                                                    className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">{item.prix} Ar</TableCell>
                                                <TableCell
                                                    className="px-5 py-4 text-gray-800 text-end text-theme-sm dark:text-white/90">
                                                    {isLoadingRow ? (
                                                        <div className="flex justify-end">
                                                            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    ) : (
                                                        <div className="relative inline-block">
                                                            <button
                                                                onClick={() =>
                                                                    toggleDropdown(item.id)
                                                                }
                                                            >
                                                                <MoreDotIcon className="size-6" />
                                                            </button>
                                                            <Dropdown
                                                                isOpen={
                                                                    openDropdownId ===
                                                                    item.id
                                                                }
                                                                onClose={closeDropdown}
                                                            >
                                                                <DropdownItem
                                                                    onItemClick={() => {
                                                                        handleEdit(item);
                                                                        closeDropdown();
                                                                    }}
                                                                >
                                                                    Modifier
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onItemClick={() =>
                                                                        openDeleteModal(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="text-red-600"
                                                                >
                                                                    Supprimer
                                                                </DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </ComponentCard>

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
                isLoading={deleteMutation.isPending}
                title="Supprimer ce type de réparation"
            />
        </>
    );
}
