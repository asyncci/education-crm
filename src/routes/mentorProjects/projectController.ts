import Elysia, { t } from "elysia";
import { authCheck, authDto } from "../_guards/authorizationGuard";
import { User } from "../user/userModel";
import { MentorProfile } from "../profile/profileModel";
import { MentorProject } from "./projectModel";
import { projectSignDto } from "./projectDto";

export const projectController = (route: string) => new Elysia({ name: 'mentorProjects', prefix: route })
    .use(authDto) 
    .guard({
        headers: 'strictAuthenticate',
        beforeHandle({ headers, set }) {
            authCheck(headers, set)
        }
    }, (app) => {
        return app
            .post('/create', async ({ body, headers, set }) => {
                const { authorization } = headers;
                const user = await User.findOne({ token: authorization })

                if (!user) {
                    set.status = 'Forbidden'
                    return { success: false, error: 'Token is invalid/expired' }
                }

                if (user.role !== 'mentor') {
                    set.status = 'Forbidden'
                    return { success: false, error: 'You are not mentor' }
                }

                const profileId = user.profile;

                if (!profileId) {
                    set.status = 'Forbidden'
                    return { success: false, error: "You don't have profile, please create first" }
                }

                const profile = await MentorProfile.findById(profileId);

                if (!profile) {
                    set.status = 'Forbidden'
                    return { success: false, error: "You don't have profile, please create first" }
                }

                const newProject = new MentorProject({ ...body, mentor: profileId })

                return await newProject
                    .save()
                    .then((projectObj) => {
                        return { success: true, message: "Successfuly added new project", data: { project: projectObj } }
                    })
                    .catch(() => {
                        set.status = 'Internal Server Error'
                        return { success: false, error: "Can't save project into database" }
                    })
            }, { body: projectSignDto })
            .delete('/delete', async ({ headers, set, body }) => {
                const project = await MentorProject.findById(body.projectId)

                if (!project) {
                    set.status = 'Not Found'
                    return { success: false, error: "Can't find project" }
                }

                const { authorization } = headers;
                const user = await User.findOne({ token: authorization })
                if (!user) {
                    set.status = 'Forbidden'
                    return { success: false, error: 'Token is invalid/expired' }
                }

                if (project.mentor?.equals(user.profile)) {
                    await MentorProject.deleteOne({ _id: body.projectId })
                        .catch(() => {
                            set.status = 'Internal Server Error'
                            return { success: false, error: "Can't delete project from database" }
                        })

                    return { success: true, message: 'Successfuly deleted project' }
                }

                set.status = 'Forbidden'
                return { success: false, error: "You are not the owner of project" }

            }, {
                body: t.Object({
                    projectId: t.String()
                })
            })
    })
    .get('/:projectId', async ({ params, set }) => {
        const project = await MentorProject.findById(params.projectId)
        if (!project) {
            set.status = 'Not Found'
            return { success: false, error: "Can't find project" }
        }

        return { success: true, message: 'Project found', data: { project: project } }
    }, {
        params: t.Object({
            projectId: t.String(),
        })
    })
    .get('/by-mentor/:profileId', async ({ params, set }) => {
        const projects = await MentorProject.find({ mentor: params.profileId })
        if (!projects) {
            set.status = 'Not Found'
            return { success: false, error: "Can't find any projects" }
        }

        return { success: true, message: 'List of projects by mentor found', data: { projects: projects } }
    }, {
        params: t.Object({
            profileId: t.String(),
        })
    })
    .get('/all', async({ set }) => {
        const projects = await MentorProject.find({})

        if(!projects) {
            set.status = 'Not Found'
            return { success: false, error: "Projects not found"}
        }

        return { success: true, message: 'Whole list of projects', data: { projects: projects} }
    })