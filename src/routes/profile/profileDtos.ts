import { t } from "elysia";

export const mentorProfileDto = t.Partial(
    t.Object({
        firstName: t.String(),
        lastName: t.String(),
        subject: t.String(),
    })
)


export const studentProfileDto = t.Partial(
    t.Object({
        firstName: t.String(),
        lastName: t.String(),
    })
)
