import mongoose, { Schema, model } from "mongoose";

let UserSchema = new Schema({
    email: String,
    password: String,
    profile: {
        firstName: String,
        lastName: String,
    },
    role: { type: String, enum: ['student', 'mentor', 'admin'] },
    token: String,
})

UserSchema.pre('save', function (next) {
    var user = this

    if (!user.isModified('password')) {
        return next()
    }

    Bun.password.hash(user.password!, {
        algorithm: 'bcrypt',
        cost: 4,
    }).catch((err) => {
        return next(err)
    }).then((hash) => {
        user.password = hash!
        next()
    })
})

export const User = model('User', UserSchema);