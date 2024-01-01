import { t } from "elysia";


export const signDto = t.Object({
    email: t.String({
        format: 'email',
        error: 'Provide correct `email`'
    }),
    password: t.Union([
        t.String(),
        t.Number(),
    ], {
        error: 'Provide correct `password`'
    }),
}, {
    error: 'Invalid authorization JSON fields'
});

export const registerDto = t.Object({
    email: t.String({
        format: 'email',
        error: 'Provide correct `email`'
    }),
    password: t.Union([
        t.String(),
        t.Number(),
    ], {
        error: 'Provide correct `password`'
    }),
    firstName: t.String({
        error: 'Provide correct `firstName`'
    }),
    lastName: t.String({
        error: 'Provide correct `lastName`'
    }),
    role: t.TemplateLiteral('${student|mentor}', {
        error: 'Provide correct `role`'
    }),
}, {
    error: 'Invalid authorization JSON fields'
});
