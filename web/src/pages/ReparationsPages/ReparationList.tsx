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
import type { Reparation } from "../../types";
import { TimeIcon } from "../../icons";
import { Link } from "react-router";

export default function ReparationList() {
    const [reparations, setReparations] = useState<Reparation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReparation, setSelectedReparation] = useState<Reparation | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Reparation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadReparations();
    }, []);

    const loadReparations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await reparationService.getAll();
            // Handle potentially wrapped data
            const items = (data as any).data || data;
            setReparations(Array.isArray(items) ? items : []);
        } catch (err) {
            setError("Erreur lors du chargement des réparations");
            console.error("Error loading réparations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedReparation(null);
        setIsModalOpen(true);
    };

    // const handleEdit = (typeReparation: TypeReparation) => {
    //     setSelectedReparation(typeReparation);
    //     setIsModalOpen(true);
    // };

    // const handleSave = async (data: Omit<TypeReparation, "id"> | TypeReparation) => {
    //     try {
    //         if ('id' in data) {
    //             await reparationService.update(data.id, data);
    //         } else {
    //             await reparationService.create(data);
    //         }
    //         await loadReparations();
    //         setIsModalOpen(false);
    //     } catch (err) {
    //         console.error("Error saving:", err);
    //         throw err;
    //     }
    // };

    const openDeleteModal = (item: Reparation) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            setIsDeleting(true);
            await reparationService.delete(itemToDelete.id);
            console.log(itemToDelete);

            await loadReparations();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            alert("Erreur lors de la suppression"); // Could use a toast here ideally
            console.error("Error deleting type reparation:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <PageMeta
                title="Réparations | Gestion"
                description="Gestion réparations"
            />
            <PageBreadcrumb pageTitle="Réparations" />

            <div className="space-y-6">
                <ComponentCard
                    title="Liste des réparations"
                    headerRight={
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                        >
                            {/* <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg> */}
                            <TimeIcon />
                            Synchroniser
                        </button>
                    }
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    ) : reparations.length === 0 ? (
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
                                                Utilisateur
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
                                        {reparations.map((reparation) => (
                                            <TableRow key={reparation.id}>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.id}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.utilisateur.identifiant}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {reparation.details.length} composants à reparer
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                                    {/* {typeReparation.prix}Ar */}
                                                    Créé
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/reparations/${reparation.id}`}>
                                                            <button
                                                                // onClick={() => handleEdit(typeReparation)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                            >
                                                                {/* <svg
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
                                                            </svg> */}
                                                                {/* <HorizontaLDots /> */}
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
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                                Voir
                                                            </button>

                                                        </Link>
                                                        {/* <button
                                                            onClick={() => openDeleteModal(typeReparation)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
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
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                            Supprimer
                                                        </button> */}
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
                isLoading={isDeleting}
            />
        </>
    );
}
