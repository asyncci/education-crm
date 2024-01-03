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
            .post('', async ({ body, headers, set }) => {
                const { authorization } = headers;

                const user = await User.findOne({ token: (authorization!) })

                if (user) {
                    const { profile } = user;
                    const findProfile = await Profile.findById(profile)
                    ///FIND AND UPDATE
                    return await Profile.findOneAndUpdate({ _id: profile }, body, { new: true })
                        .then(async (doc) => {
                            if (doc)
                                return { success: true, message: 'Successfuly updated profile', data: doc }


                            /// OR CREATE
                            const profile = new Profile(body);
                            return await profile
                                .save()
                                .then(async (profileObj) => {
                                    await User.updateOne({ _id: user._id }, { $set: { profile: profileObj._id } })
                                        .catch(() => {
                                            return { success: false, error: "Can't update user profile in database" }
                                        })

                                    return { success: true, message: 'Successfuly created profile', data: profileObj }
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
                body: updateProfile
            })
    })
    .get(':profileId', async ({ params, set }) => {
        const { profileId } = params
        const profile = await Profile.findById(profileId)

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