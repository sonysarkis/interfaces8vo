import { z } from "zod";

const loginSchema = z.object({
    email: z.string().max(500, "El email debe tener máximo 500 caracteres").email("El email no es válido"),
    password: z.string().max(500, "La contraseña debe tener máximo 500 caracteres").min(6, "La contraseña debe tener al menos 6 caracteres")
});

export function validateLogin(input) {
    return loginSchema.safeParse(input);
}