import * as zod from "zod";

export const sampleSchema = zod.object({
  id: zod
    .string({ required_error: "Um Identificador (ID) é necessário" })
    .uuid(),
  firstName: zod
    .string()
    .min(1, "Primeiro nome é obrigatório")
    .max(255, "Você ultrapassou o limite de caracteres (255)"),
  lastName: zod
    .string()
    .min(1, "Segundo nome é obrigatório")
    .max(255, "Você ultrapassou o limite de caracteres (255)"),
  age: zod
    .number()
    .min(1, "Idade é obrigatória")
    .nonnegative("Idade deve ser um número positivo"),
  email: zod.string().email("E-mail não está no formato correto"),
  password: zod
    .string()
    .min(8, "Senha deve conter no mínimo 8 caracteres")
    .regex(/^[^\s]+$/, "Senha não deve conter espaços"),
});

export type sampleType = zod.infer<typeof sampleSchema>;
