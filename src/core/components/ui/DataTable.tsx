import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  showTooltip?: boolean; // Автоматически показывать tooltip для обрезанного текста
  maxWidth?: string; // Максимальная ширина для обрезки
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "Нет данных",
  getRowKey,
  className,
}: DataTableProps<T>) {
  // Обёртка для автоматического добавления tooltip
  const wrapWithTooltip = (content: React.ReactNode, column: Column<T>) => {
    if (column.showTooltip && typeof content === 'string') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`truncate ${column.maxWidth || 'max-w-xs'}`}>
                {content}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] break-words">
              <p className="whitespace-pre-wrap">{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Если content - это React элемент с truncate, обернуть в tooltip
    if (column.showTooltip && React.isValidElement(content)) {
      const props = content.props;
      if (props.className?.includes('truncate')) {
        const text = props.children;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {content}
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] break-words">
                <p className="whitespace-pre-wrap">{text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    }
    
    return content;
  };

  return (
    <div className={`rounded-lg border ${className || ""}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => {
                  const content = column.render ? column.render(item) : (item[column.key as keyof T] as React.ReactNode);
                  return (
                    <TableCell key={column.key} className={column.className}>
                      {wrapWithTooltip(content, column)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

