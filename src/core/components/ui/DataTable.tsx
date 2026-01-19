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
  showTooltip?: boolean;
  maxWidth?: string;
  truncate?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  className?: string;
  getRowClassName?: (item: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "Нет данных",
  getRowKey,
  className,
  getRowClassName,
}: DataTableProps<T>) {
  const wrapWithTooltip = (content: React.ReactNode, column: Column<T>) => {
    const shouldTruncate = column.truncate !== false;

    if (column.showTooltip && typeof content === 'string') {
      const contentNode = shouldTruncate ? (
        <div className={`truncate ${column.maxWidth || 'max-w-xs'}`}>
          {content}
        </div>
      ) : (
        <div>{content}</div>
      );

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {contentNode}
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] break-words">
              <p className="whitespace-pre-wrap">{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
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
              <TableRow 
                key={getRowKey(item)}
                className={getRowClassName ? getRowClassName(item) : undefined}
              >
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

