import { Schema } from "mongoose";

const Project = new Schema({
    title: String,
    description: String,
    mentor: { type: Schema.Types.ObjectId, ref: 'User'},
})