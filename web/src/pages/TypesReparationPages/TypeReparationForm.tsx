import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import type { TypeReparation } from "../../types";
import Button from "../../components/ui/button/Button";

interface TypeReparationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<TypeReparation, "id"> | TypeReparation) => Promise<void>;
    initialData?: TypeReparation | null;
}

export default function TypeReparationForm({
    isOpen,
    onClose,
    onSave,
    initialData,
}: TypeReparationFormProps) {
    const isEditMode = !!initialData;

    // Initialisation avec les nouveaux champs
    const [formData, setFormData] = useState({
        nom: "",
        duree: "",
        prix: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nom: initialData.nom || "",
                    duree: initialData.duree?.toString() || "",
                    prix: initialData.prix?.toString() || "",
                });
            } else {
                setFormData({
                    nom: "",
                    duree: "",
                    prix: "",
                });
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation basique
        if (!formData.nom.trim() || !formData.duree || !formData.prix) {
            setError("Tous les champs sont obligatoires");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                nom: formData.nom,
                duree: parseInt(formData.duree, 10),
                prix: parseFloat(formData.prix),
            };

            if (isEditMode && initialData) {
                await onSave({ ...initialData, ...payload });
            } else {
                await onSave(payload);
            }
            onClose();
        } catch (err) {
            setError("Erreur lors de l'enregistrement");
            console.error("Error saving type reparation:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {isEditMode ? "Modifier" : "Nouveau"} Type de Réparation
                    </h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {error && (
                            <div className="p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Nom du Type
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Ex: Vidange"
                            />
                        </div>
                        <div>
                            <label htmlFor="duree" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Durée estimée (secondes)
                            </label>
                            <input
                                type="number"
                                id="duree"
                                name="duree"
                                value={formData.duree}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Ex: 60"
                            />
                        </div>
                        <div>
                            <label htmlFor="prix" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Prix (Ar)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                id="prix"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Ex: 49.99"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button disabled={submitting} size="sm" variant="outline" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button size="sm" variant="primary" disabled={submitting}>
                                {submitting ? ( 
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Traitement...
                                    </>
                                ) : (isEditMode ? "Mettre à jour" : "Créer")}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
