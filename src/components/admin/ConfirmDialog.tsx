import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  description?: string;
  message?: string;
  title?: string;
  confirmLabel?: string;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  description,
  message,
  title = 'Confirmer l action',
  confirmLabel = 'Supprimer',
  loading = false,
  danger = true,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="max-w-md rounded-xl border border-slate-200 bg-white p-0 shadow-md">
        <DialogHeader className="border-b border-slate-200 px-6 py-5 text-left">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-semibold text-slate-800">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-slate-500">
            {description ?? message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-70"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium text-white disabled:opacity-70 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0D354E] hover:bg-[#0D354E]/90'
            }`}
          >
            {loading && <Spinner className="h-4 w-4" />}
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
