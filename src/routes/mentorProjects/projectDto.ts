import { t } from "elysia";

export const projectSignDto = t.Object({
    title: t.String(),
    description: t.String(),
})