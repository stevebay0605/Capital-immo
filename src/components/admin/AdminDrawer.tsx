import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AdminDrawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: AdminDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="w-full max-w-[520px] border-l border-slate-200 bg-white p-0 backdrop-blur-sm sm:max-w-[520px]">
        <SheetHeader className="border-b border-slate-200 px-6 py-5">
          <SheetTitle className="text-xl font-semibold text-slate-800">{title}</SheetTitle>
          {description && (
            <SheetDescription className="mt-1 text-sm text-slate-500">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <SheetFooter className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
