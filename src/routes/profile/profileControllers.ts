import Elysia from "elysia";
import { authCheck } from "../guards/authorizationGuard";

export const profileControllers = new Elysia({ name: 'profile' })
    .onBeforeHandle(({headers, set}) => authCheck(headers, set))
    .post('', ({ headers, body }) => {

    })