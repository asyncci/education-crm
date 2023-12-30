import Elysia from "elysia";
import { authorization } from "./authorization/userController";

export const publicApiPlugin = (route: string) => new Elysia({ name: 'private api', prefix: route })
    .get('/', (context) => {
        console.log(context.path)
    })
    .use(authorization)
