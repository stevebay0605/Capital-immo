import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: ReactNode;
  rowClassName?: (row: T) => string | undefined;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyState,
  rowClassName,
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  if (!loading && data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 ${column.headerClassName ?? ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-${index}`} className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {column.key === columns[0]?.key && (
                          <Skeleton className="h-11 w-11 rounded-lg bg-slate-200" />
                        )}
                        <div className="min-w-0 flex-1">
                          <Skeleton className="h-3 w-32 rounded bg-slate-200" />
                          <Skeleton className="mt-2 h-2 w-20 rounded bg-slate-100" />
                        </div>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data.map((row, rowIndex) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={(event) => {
                    if (!onRowClick) return;

                    const target = event.target as HTMLElement;
                    if (target.closest('button, a, input, select, textarea, label, [data-no-row-click]')) {
                      return;
                    }

                    onRowClick(row);
                  }}
                  className={`transition-colors hover:bg-slate-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} ${
                    rowClassName?.(row) ?? ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={`px-4 py-3 ${column.cellClassName ?? ''}`}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
