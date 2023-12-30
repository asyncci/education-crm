import Elysia from "elysia";

export const privateApiPlugin = (route: string) => new Elysia({ name: 'public api', prefix: route})