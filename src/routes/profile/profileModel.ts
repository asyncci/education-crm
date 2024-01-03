import mongoose, { Schema, model } from "mongoose";

let MentorSchema = new Schema({
    firstName: String,
    lastName: String,
    subject: String,
})

export const MentorProfile = model('MentorProfile', MentorSchema);

let StudentSchema = new Schema({
    firstName: String,
    lastName: String,
})

export const StudentProfile = model('StudentProfile', StudentSchema);