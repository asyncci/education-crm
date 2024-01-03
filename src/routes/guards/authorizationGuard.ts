import Elysia, { Context, t } from "elysia";
import { verify } from "jsonwebtoken";
import { config } from "../../../config";


export const authDto = new Elysia()
    .model({
        strictAuthenticate: t.Object({
            authorization: t.String()
        }),
        optionalAuthenticate: t.Object({
            authorization: t.Optional(t.String())
        })
    })

export function authCheck(headers: any, set: any) {
    const token = headers.authorization;
    if (!token) {
        set.status = 'Unauthorized'
        return { success:false, error: 'Token was not provided' }
    }

    const verified = verify(token, config.secretKey);
    if (!verified) {
        set.status = 'Unauthorized'
        return { success:false, error: 'Failed to authenticate token' }
    }
}