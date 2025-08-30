import { z } from "zod";

const schema = z.object({
    name: z.string().max(500),
    primary: z.string().max(500),
    secondary: z.string().max(500),
    accent: z.string().max(500),
    background: z.string().max(500),
    text: z.string().max(500),
    familyTitle: z.string().max(500),
    sizeTitle: z.string().max(500),
    weightTitle: z.string().max(500),
    familySubtitle: z.string().max(500),
    sizeSubtitle: z.string().max(500),
    weightSubtitle: z.string().max(500),
    familyBody: z.string().max(500),
    sizeBody: z.string().max(500),
    weightBody: z.string().max(500)
});

export function validateStyle(input) {
    return schema.safeParse(input);
}