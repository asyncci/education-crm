import Elysia, { t } from "elysia";
import { User } from './userModel';

export const authorization = new Elysia({ name: 'authorization' })
    .post('/register', () => { })
    .post('/auth', async ({ body, set }) => {
        const email = body.email;

        //const user = await User.findOne({ 'email': { $regex: new RegExp('' + email, 'i') } })
        if (true) {
            set.status = 'Not Found'
            return 'Invalid Credentials'
        }

        return 'Ok'
    }, {
        body: t.Object({
            email: t.String({
                format: 'email',
                error: 'Provide the correct `email`'
            }),
            password: t.Union([
                t.String(),
                t.Number(),
            ], {
                error: 'Provide the correct `password`'
            }),
        }, {
            error: 'Invalid authorization JSON fields'
        })
    })