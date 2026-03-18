'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface CollegeTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function CollegeTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  isLoading = false,
}: CollegeTableProps<T>) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-200 h-12">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    "text-sm font-bold text-gray-900 px-6",
                    column.className
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="border-gray-100 h-16">
                    {columns.map((_, j) => (
                      <TableCell key={`skeleton-cell-${j}`} className="px-6">
                        <div className="h-4 w-full bg-gray-100 animate-pulse rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent h-32">
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-500 font-medium"
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, rowIndex) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "group border-gray-100 h-16 transition-colors hover:bg-gray-50/50 cursor-pointer",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={cn(
                          "px-6 text-sm text-gray-600 transition-colors group-hover:text-gray-900",
                          column.className
                        )}
                      >
                        {typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : (item[column.accessor] as React.ReactNode)}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Fixed the closing tag for TableBody which was incorrectly typed as Body
