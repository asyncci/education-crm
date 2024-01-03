import { t } from "elysia";

export const updateProfile = t.Partial(
    t.Object({
        firstName: t.String(),
        lastName: t.String(),
        subject: t.String(),
    })
)