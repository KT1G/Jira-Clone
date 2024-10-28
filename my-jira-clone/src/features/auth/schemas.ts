import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo no valido"),
  password: z.string().min(1, "La contraseña debe tener al menos un caracter"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Debe introducir un nombre"),
  email: z.string().email("Correo no valido"),
  password: z.string().min(8, "Mínimo de 8 caracteres requeridos"),
});

