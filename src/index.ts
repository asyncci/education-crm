import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { routes } from "./routes";
import mongoose from "mongoose";
import { config } from "../config";

console.log(Bun.env.MONGODB)
if(!Bun.env.MONGODB) {
  throw new Error('Provide the "MONGODB" env variable (link to database server)')
}

await mongoose.connect(Bun.env.MONGODB!)
  .then(() => console.log('Successfuly connected to MongoDB'))
  .catch((err) => {
    throw new Error(`Can't connect to database: ${err}`)
  });

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Education CRM - Documentation',
        version: '0.0.1'
      },
      tags: [
        { name: 'User Register' },
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Create Mentor Profile' },
        { name: 'Create Student Profile'},
        { name: 'Get Mentor', description: 'Get exact mentor, needs **mentors profile** id' },
        { name: 'Get Student', description: 'Get exact student, needs **students profile** id' },
        { name: 'List of Mentors'},
        { name: 'List of Students'},
        { name: 'Create Project', description: 'Create project, needs to be authenticated as **mentor** and pass **auth token** in headers' },
        { name: 'Delete Project', description: 'Only owner(exact mentor) can delete **certain project** passed, id of project needs to be passed through **body**' },
        { name: 'Get Mentor Project', description: "Gets exact mentor's project, needs **mentors profile** id in **params**" },
        { name: 'Get Projects'},
        { name: 'Get Project', description: "Needs project's id" },
      ]
    }
  }))
  .use(routes(''))
  .listen(config.port);
