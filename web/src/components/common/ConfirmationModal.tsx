import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    type?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    isLoading = false,
    type = "danger",
}: ConfirmationModalProps) {
    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
            <div className="p-6 text-center">
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${type === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                    <svg
                        className={`h-6 w-6 ${type === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                    {message}
                </p>
                <div className="flex items-center justify-center gap-3">
                    {/* <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        {cancelText}
                    </button> */}
                    <Button size="sm" variant="outline" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    {/* <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Traitement...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button> */}
                    <Button size="sm" disabled={isLoading} onClick={handleConfirm} className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'danger'
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                            }`}>
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Traitement...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
