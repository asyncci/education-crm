import Elysia, { Context, UnwrapRoute, t } from "elysia";
import { User } from "../authorization/userModel";
import { Profile } from "./profileModel";
import { updateProfile } from "./profileDtos";
import { authCheck, authDto } from "../guards/authorizationGuard";

export const profileController = (route: string) => new Elysia({ name: 'profile', prefix: route })
    .use(authDto)
    .guard({
        headers: 'strictAuthenticate',
        beforeHandle({ headers, set }) {
            authCheck(headers, set)
        }
    }, (app) => {
        return app
            .put('', async ({ body, headers, set }) => {
                const { authorization } = headers;
                const user = await User.findOne({ token: (authorization!) })
                if (!user) {
                    set.status = 'Bad Request'
                    return { error: 'Token expired/invalid' }
                }
                const profileId = user.profile;

                if (!profileId) {
                    set.status = 'Not Found'
                    return {
                        error: 'Profile is not created'
                    }
                }

                let profile = await Profile.findById(profileId);

                if (!profile) {
                    set.status = 'Not Found'
                    return {
                        error: 'Profile not found'
                    }
                }

                await Profile.updateOne({ _id: profile._id }, { $set: { ...body } })
                    .catch(() => {
                        set.status = 'Internal Server Error'
                        return {
                            error: "Can't save profile to database"
                        }
                    })
                    
                const data = {
                    user: {
                        _id: user._id,
                        email: user.email,
                        profile: user.profile || null,
                        role: user.role,
                    },
                    profile: {
                        _id: profile._id,
                        firstName: body.firstName,
                        lastName: body.lastName,
                    }
                }

                return {
                    message: 'Successfuly updated profile',
                    data: data
                }

            }, {
                body: updateProfile
            })
            //Create profile
            .post('', async ({ body, headers, set }) => {
                const { authorization } = headers;
                const user = await User.findOne({ token: (authorization!) })
                if (!user) {
                    set.status = 'Bad Request'
                    return { error: 'Token expired/invalid' }
                }
                const profileId = user.profile;

                if (profileId) {
                    let profile = await Profile.findById(profileId);
                    if (profile) {
                        set.status = 'Conflict'
                        return {
                            error: 'Already created'
                        }
                    }
                }
                let profile = new Profile(body)
                
                await profile
                    .save()
                    .then(async (profile) => {
                        user.profile = profile._id;
                        await User.updateOne({ _id: user._id }, { $set: { profile: profile._id } })
                            .catch(() => {
                                set.status = 'Internal Server Error'
                                return {
                                    error: "Can't update User's `profile` field in database"
                                }
                            })

                        const data = {
                            user: {
                                _id: user._id,
                                email: user.email,
                                profile: user.profile || null,
                                role: user.role,
                            },
                            profile: {
                                _id: profile._id,
                                firstName: profile.firstName,
                                lastName: profile.lastName,
                            }
                        }

                        return {
                            message: 'Successfuly created profile',
                            data: data
                        }
                    })
                    .catch(() => {
                        set.status = 'Internal Server Error'
                        return { error: "Can't store in database" }
                    })

            }, {
                body: updateProfile
            })
    })
    .get(':profileId', async ({ params, set }) => {
        const { profileId } = params
        const profile = await Profile.findById(profileId)

        if (!profile) {
            set.status = 'Not Found'
            return { error: 'No Data' }
        }

        return { data: profile }
    }, {
        params: t.Object({
            profileId: t.String()
        })
    })