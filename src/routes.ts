import Elysia from "elysia";
import { userController } from "./routes/user/userController";
import { profileController } from "./routes/profile/profileController";
import { projectController } from "./routes/mentorProjects/projectController";

export const routes = (route: string) => new Elysia({ name: 'routes', prefix: route })
    .onError(({ code, error }) => {
        switch (code) {
            case "VALIDATION":
                return {
                    message: error.model.error,
                    details: error.all.map((val) => {
                        const { path, schema, message } = val
                        const field = path.substring(1)
                        return { field: field, error: schema.error, message: message }
                    })
                }
            default:
                return {
                    error: error.name,
                    message: error.message
                }
        }
    })
    .use(userController)
    .use(profileController('/profile'))
    .use(projectController('/project'))
