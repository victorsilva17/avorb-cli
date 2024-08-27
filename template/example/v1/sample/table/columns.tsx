"use client";

import { sampleType } from "@/core/models/sample";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableFilterRows } from "@/components/custom/DataTable/filterRows";
import {
  numberFilterFn,
  stringFilterFn,
} from "@/components/custom/DataTable/functions";
import { DataTableSortColumn } from "@/components/custom/DataTable/sortColumns";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GetColumnsProps {
  onEdit: (sample: sampleType) => void;
  onDelete: (sample: sampleType) => void;
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select tudo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Email" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Email",
      },
    },
    {
      accessorKey: "password",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Senha" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Senha",
      },
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Primeiro Nome" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Primeiro Nome",
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Segundo Nome" />
          <DataTableFilterRows column={column} dataType="string" />
        </div>
      ),
      filterFn: stringFilterFn,
      meta: {
        filter: "string",
        label: "Segundo Nome",
      },
    },
    {
      accessorKey: "age",
      header: ({ column }) => (
        <div className="flex gap-2 items-center">
          <DataTableSortColumn column={column} title="Idade" />
          <DataTableFilterRows column={column} dataType="number" />
        </div>
      ),
      filterFn: numberFilterFn,
      meta: {
        filter: "number",
        label: "Idade",
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const sample = row.original;

        return (
          <div className="w-full flex justify-start items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(sample)}
                  >
                    <FiEdit3 size={20} className="text-gray-800" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(sample)}
                  >
                    <MdDelete size={20} className="text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deletar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ] as ColumnDef<sampleType>[];
};
