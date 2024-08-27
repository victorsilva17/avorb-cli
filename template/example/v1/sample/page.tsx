"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteSample, getAllSample } from "@/core/handlers/sample";
import { sampleType } from "@/core/models/sample";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/data-table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ZodError } from "zod";

export const selectedSampleRowAtom = atom<sampleType | null>(null);
export const actionToPerformOnSampleAtom = atom<
  "POST" | "EDIT" | "DELETE" | null
>(null);

export default function Sample() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery<sampleType[]>({
    queryKey: ["samples"],
    queryFn: getAllSample,
  });

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useAtom(selectedSampleRowAtom);
  const [, setActionToPerform] = useAtom(actionToPerformOnSampleAtom);

  const mutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: (id: string) => {
      if (id) {
        queryClient.setQueryData(["samples"], (oldData: sampleType[]) =>
          oldData.filter((data) => data.id !== id),
        );

        toast({
          title: "Exclusão de sample",
          description: "Sample deletado com sucesso!",
        });
      }
    },
    onMutate: () => handleCloseConfirmDialog(),
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: "Erro ao excluir um sample",
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  const handleDeletion = async () => {
    if (selectedRow?.id) {
      mutation.mutate(selectedRow.id);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmationDialogOpen(false);
    setActionToPerform("POST");
    setSelectedRow(null);
  };

  const onEdit = (sample: sampleType) => {
    setSelectedRow(sample);
    setActionToPerform("EDIT");
  };

  const onDelete = (sample: sampleType) => {
    setSelectedRow(sample);
    setActionToPerform("DELETE");
    setIsConfirmationDialogOpen(true);
  };

  return (
    <div className="w-full h-full">
      {/* Data Table */}
      <DataTable
        isLoading={isLoading}
        columns={getColumns({
          onEdit,
          onDelete,
        })}
        data={data ?? []}
      />

      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deleção de registro.</DialogTitle>
            <DialogDescription className="mt-6">
              <span>
                Tem certeza que deseja deletar o registro de email{" "}
                {selectedRow?.email}
              </span>

              <div className="w-full flex items-center justify-end gap-4 mt-4">
                <Button onClick={handleCloseConfirmDialog} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={handleDeletion} variant="destructive">
                  Confirmar
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
