import Elysia, { t } from "elysia";
import { User } from "./userModel";
import { registerDto, signDto } from "./userDtos";
import { sign } from "jsonwebtoken";
import { config } from "../../config";
import { comparePassword } from "../lib/core";

export const authorization = new Elysia({ name: 'authorization' })
    .post('/register', async ({ body, set }) => {
        const { email, firstName, lastName, password, role } = body
        const user = await User.findOne({ 'email': email })
        if (user) {
            set.status = 'Conflict'
            return { error: 'User already exists' }
        }

        let userData = new User()

        userData.email = email
        userData.password = typeof password === 'number' ? password.toString() : password
        userData.profile = {
            firstName: firstName,
            lastName: lastName,
        }
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

                const data = {
                    email: userObj.email,
                    firstName: userObj.profile?.firstName,
                    lastName: userObj.profile?.lastName,
                    role: userObj.role,
                    token: token,
                };
                set.status = 'Created'
                return { message: 'User created', data: data }
            })
            .catch(() => {
                set.status = 'Internal Server Error'
                return { error: 'Database cannot register user' }
            })
    }, { body: registerDto })
    .post('/auth', async ({ body, set }) => {
        const { email, password } = body;

        const user = await User.findOne({ 'email': email })
        
        if (!user) {
            set.status = 'Unauthorized'
            return { error: 'Invalid Credentials' }
        }

        const passwordString = typeof password == 'number' ? password.toString() : password;
        const validPassword = comparePassword(passwordString, user?.password!);

        if (!validPassword) {
            set.status = 'Unauthorized'
            return { error: 'Invalid Credentials' }
        }

        const token = sign(
            { user: { _id: user._id, email: user.email || '', role: user.role } },
            config.secretKey,
            { expiresIn: config.expiresIn }
        )

        await User.updateOne({ _id: user._id }, { $set: { token }})

        const data = {
            email: user.email,
            firstName: user.profile?.firstName,
            lastName: user.profile?.lastName,
            role: user.role,
            token: token,
        };

        set.status = 'Accepted'
        return { message: 'Logged in successfuly', data: data }

    }, { body: signDto })
    .onError(({ code, error }) => {
        switch (code) {
            case "VALIDATION":
                console.log(error.all)
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