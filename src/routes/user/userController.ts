import Elysia, { t } from "elysia";
import { User } from "./userModel";
import { registerDto, signDto } from "./userDtos";
import { sign } from "jsonwebtoken";
import { config } from "../../../config";
import { comparePassword } from "../../lib/core";

export const userController = new Elysia({ name: 'authorization' })
    .post('/register', async ({ body, set }) => {
        const { email, password, role } = body
        const user = await User.findOne({ 'email': email })
        if (user) {
            set.status = 'Conflict'
            return { success: false, error: 'User already exists' }
        }

        let userData = new User()

        userData.email = email
        userData.password = typeof password === 'number' ? password.toString() : password
        userData.role = role

        return await userData
            .save()
            .then(async (userObj) => {
                const token = sign(
                    { user: { _id: userObj._id, email: userObj?.email || '', role: userObj.role } },
                    config.secretKey,
                    { expiresIn: config.expiresIn }
                )

                await User.updateOne({ _id: userObj._id }, { $set: { token: token } })
                    .catch(() => {
                        set.status = 'Internal Server Error'
                        return {
                            success: false,
                            error: "Can't save user to database"
                        }
                    })

                const data = {
                    _id: userObj._id,
                    email: userObj.email,
                    profile: userObj.profile || null,
                    role: userObj.role,
                    token: token,
                };
                set.status = 'Created'
                return { success: true, message: 'User created', data: data }
            })
            .catch(() => {
                set.status = 'Internal Server Error'
                return { success: false, error: 'Database cannot register user' }
            })
    }, { body: registerDto })
    .post('/auth', async ({ body, set }) => {
        const { email, password } = body;

        const user = await User.findOne({ 'email': email })

        if (!user) {
            set.status = 'Unauthorized'
            return { success: false, error: 'Invalid Credentials' }
        }

        const passwordString = typeof password == 'number' ? password.toString() : password;
        const validPassword = comparePassword(passwordString, user?.password!);

        if (!validPassword) {
            set.status = 'Unauthorized'
            return { success: false, error: 'Invalid Credentials' }
        }

        const token = sign(
            { user: { _id: user._id, email: user.email || '', role: user.role } },
            config.secretKey,
            { expiresIn: config.expiresIn }
        )

        await User.updateOne({ _id: user._id }, { $set: { token } })
            .catch(() => {
                set.status = 'Internal Server Error'
                return {
                    success: false,
                    error: "Can't save User's `token` field to database"
                }
            })

        const data = {
            _id: user._id,
            email: user.email,
            profile: user.profile || null,
            role: user.role,
            token: token,
        };

        set.status = 'Accepted'
        return { success: true, message: 'Logged in successfuly', data: data }

    }, { body: signDto })