import { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
    title: String,
    description: String,
    mentor: { type: Schema.Types.ObjectId, ref: 'MentorProfile'},
})

export const MentorProject = model('MentorProject', ProjectSchema);
