import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import type { TypeReparation } from "../../types";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

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

  const [formData, setFormData] = useState({
    nom: "",
    duree: "",
    prix: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        nom: initialData.nom ?? "",
        duree: initialData.duree?.toString() ?? "",
        prix: initialData.prix?.toString() ?? "",
      });
    } else {
      setFormData({ nom: "", duree: "", prix: "" });
    }

    setError(null);
  }, [isOpen, initialData]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.duree || !formData.prix) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        nom: formData.nom,
        duree: Number(formData.duree),
        prix: Number(formData.prix),
      };

      if (isEditMode && initialData) {
        await onSave({ ...initialData, ...payload });
      } else {
        await onSave(payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        
        {/* Header */}
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Modifier" : "Nouveau"} Type de Réparation
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Renseignez les informations du type de réparation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {/* Body scrollable */}
          <div className="custom-scrollbar px-2 pb-3">
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Label>Nom du type</Label>
                <Input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  placeholder="Ex : Vidange"
                />
              </div>

              <div>
                <Label>Durée estimée (secondes)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.duree}
                  onChange={(e) => handleChange("duree", e.target.value)}
                  placeholder="Ex : 60"
                />
              </div>

              <div>
                <Label>Prix (Ar)</Label>
                <Input
                  type="number"
                  min="0"
                  step={0.01}
                  value={formData.prix}
                  onChange={(e) => handleChange("prix", e.target.value)}
                  placeholder="Ex : 50 000"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Annuler
            </Button>

            <Button size="sm" variant="primary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Traitement...
                </>
              ) : isEditMode ? (
                "Mettre à jour"
              ) : (
                "Créer"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
