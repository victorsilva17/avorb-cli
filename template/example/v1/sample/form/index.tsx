"use client";

import { sampleSchema, sampleType } from "@/core/models/sample";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createSample, updateSample } from "@/core/handlers/sample";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import { actionToPerformOnSampleAtom, selectedSampleRowAtom } from "../page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiPlus } from "react-icons/fi";

const formPostSchema = sampleSchema.omit({ id: true });

export function SampleForm() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRow] = useAtom(selectedSampleRowAtom);
  const [actionToPerform] = useAtom(actionToPerformOnSampleAtom);

  const isEdition = actionToPerform == "EDIT";

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<sampleType>({
    resolver: zodResolver(isEdition ? sampleSchema : formPostSchema),
    defaultValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      password: "",
    },
  });

  useEffect(() => {
    if (selectedRow && isEdition) {
      form.setValue("id", selectedRow.id);
      form.setValue("firstName", selectedRow.firstName);
      form.setValue("lastName", selectedRow.lastName);
      form.setValue("email", selectedRow.email);
      form.setValue("password", selectedRow.password);
      form.setValue("age", selectedRow.age);
      setIsFormOpen(true);
    }
  }, [form, isEdition, selectedRow]);

  const mutation = useMutation({
    mutationFn: isEdition ? updateSample : createSample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["samples"] });
      toast({
        title: `${isEdition ? "Edição" : "Criação "} de um Sample`,
        description: `Sample ${isEdition ? "editado" : "criado"} com sucesso!`,
      });
      form.reset();
      setIsFormOpen(false);
    },
    onError(error) {
      let errorMessage = error.message;
      if (error instanceof ZodError) errorMessage = error.errors[0].message;

      toast({
        title: `Erro ao ${isEdition ? "editar" : "criar"} um Sample`,
        description: errorMessage,
        className: "bg-red-500 border-red-900 text-white",
      });
    },
  });

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-2 flex gap-2 items-center">
          <FiPlus size={20} />
          <span>Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Formulário - {isEdition ? "Edição" : "Criação"} de Sample
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="flex flex-col items-stretch justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Primeiro Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira seu primeiro nome"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Segundo nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira seu segundo nome" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field: { value, onChange }, ...field }) => {
                return (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Insira sua idade"
                        {...field}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Insira seu email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Insira sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" className="mt-4">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
