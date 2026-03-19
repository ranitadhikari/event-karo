'use client';

import React from 'react';
import { cn } from '@/utils/lib/utils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function AdminTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found.',
  className,
}: AdminTableProps<T>) {
  return (
    <div className={cn(
      "w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
      className
    )}>
      <Table>
        <TableHeader className="bg-muted/50 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-b border-border">
            {columns.map((column, index) => (
              <TableHead 
                key={index}
                className="h-14 px-6 text-xs font-bold text-muted-foreground uppercase tracking-widest"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse border-b border-border">
                {columns.map((_, j) => (
                  <TableCell key={j} className="h-16 px-6">
                    <div className="h-4 w-2/3 bg-muted rounded-lg" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl opacity-50">📂</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {emptyMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow 
                key={(item as any).id || (item as any)._id || index} 
                className="group border-b border-border hover:bg-accent/50 transition-colors duration-200"
              >
                {columns.map((column, index) => (
                  <TableCell 
                    key={index}
                    className="h-16 px-6 py-4 text-sm font-medium text-foreground"
                  >
                    {column.cell 
                      ? column.cell(item) 
                      : (item[column.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
