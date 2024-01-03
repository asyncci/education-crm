import Elysia, { Context, UnwrapRoute, t } from "elysia";
import { User } from "../user/userModel";
import { MentorProfile, StudentProfile } from "./profileModel";
import { mentorProfileDto, studentProfileDto } from "./profileDtos";
import { authCheck, authDto } from "../_guards/authorizationGuard";

export const profileController = (route: string) => new Elysia({ name: 'profile', prefix: route })
    .use(authDto)
    .guard({
        headers: 'strictAuthenticate',
        beforeHandle({ headers, set }) {
            authCheck(headers, set)
        }
    }, (app) => {
        return app
            .post('/mentor', async ({ body, headers, set }) => {
                const { authorization } = headers;

                const user = await User.findOne({ token: (authorization!) })

                if (user) {
                    const { profile, role } = user;

                    if (role !== 'mentor') {
                        set.status = 'Forbidden'
                        return { success: false, error: "You can't sign to mentor data", message: `Your role is ${role}` }
                    }

                    ///FIND AND UPDATE
                    return await MentorProfile.findOneAndUpdate({ _id: profile }, body, { new: true })
                        .then(async (doc) => {
                            if (doc)
                                return { success: true, message: 'Successfuly updated profile', data: { profile: doc } }


                            /// OR CREATE
                            const profile = new MentorProfile(body);
                            return await profile
                                .save()
                                .then(async (profileObj) => {
                                    await User.updateOne({ _id: user._id }, { $set: { profile: profileObj._id } })
                                        .catch(() => {
                                            return { success: false, error: "Can't update user profile in database" }
                                        })

                                    return { success: true, message: 'Successfuly created profile', data: { profile: profileObj } }
                                })
                                .catch(() => {
                                    set.status = 'Internal Server Error'
                                    return { success: false, error: "Can't save profile to database" }
                                })
                        })
                }
                else {
                    set.status = 'Not Found'
                    return { success: false, error: 'User not found' }
                }
            }, {
                body: mentorProfileDto
            })
            .post('/student', async ({ body, headers, set }) => {
                const { authorization } = headers;

                const user = await User.findOne({ token: (authorization!) })

                if (user) {
                    const { profile, role } = user;

                    if (role !== 'student') {
                        set.status = 'Forbidden'
                        return { success: false, error: "You can't sign to student data", message: `Your role is ${role}` }
                    }

                    ///FIND AND UPDATE
                    return await StudentProfile.findOneAndUpdate({ _id: profile }, body, { new: true })
                        .then(async (doc) => {
                            if (doc)
                                return { success: true, message: 'Successfuly updated profile', data: { profile: doc } }


                            /// OR CREATE
                            const profile = new StudentProfile(body);
                            return await profile
                                .save()
                                .then(async (profileObj) => {
                                    await User.updateOne({ _id: user._id }, { $set: { profile: profileObj._id } })
                                        .catch(() => {
                                            return { success: false, error: "Can't update user profile in database" }
                                        })

                                    return { success: true, message: 'Successfuly created profile', data: { profile: profileObj } }
                                })
                                .catch(() => {
                                    set.status = 'Internal Server Error'
                                    return { success: false, error: "Can't save profile to database" }
                                })
                        })
                }
                else {
                    set.status = 'Not Found'
                    return { success: false, error: 'User not found' }
                }
            }, {
                body: studentProfileDto
            })
    })
    .get('mentor/:profileId', async ({ params, set }) => {
        const { profileId } = params
        const profile = await MentorProfile.findById(profileId)

        if (!profile) {
            set.status = 'Not Found'
            return { success: false, error: 'No Data' }
        }

        return { success: true, message: 'Successfuly got profile', data: profile }
    }, {
        params: t.Object({
            profileId: t.String()
        })
    })
    .get('/student/:profileId', async ({ params, set }) => {
        const { profileId } = params
        const profile = await StudentProfile.findById(profileId)

        if (!profile) {
            set.status = 'Not Found'
            return { success: false, error: 'No Data' }
        }

        return { success: true, message: 'Successfuly got profile', data: profile }
    }, {
        params: t.Object({
            profileId: t.String()
        })
    })
    .get('/mentors', async ({ set }) => {
        const profiles = await MentorProfile.find({})

        if (!profiles) {
            set.status = 'Not Found'
            return { success: false, error: 'No Data' }
        }

        return { success: true, message: 'Successfuly got mentor profiles', data: profiles }
    })
    .get('/students', async ({ set }) => {
        const profiles = await StudentProfile.find({})

        if (!profiles) {
            set.status = 'Not Found'
            return { success: false, error: 'No Data' }
        }

        return { success: true, message: 'Successfuly got student profiles', data: profiles }
    })