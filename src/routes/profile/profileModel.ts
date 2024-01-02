import mongoose, { Schema, model } from "mongoose";

let ProfileSchema = new Schema({
    firstName: String,
    lastName: String,
})

export const Profile = model('Profile', ProfileSchema);