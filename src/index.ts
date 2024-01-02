import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { routes } from "./routes";
import mongoose from "mongoose";
import { config } from "../config";

await mongoose.connect(Bun.env.MONGODB || '')
  .then(() => console.log('Successfuly connected to MongoDB'))
  .catch(() => console.log('Provide the "MONGODB" env variable (link to database server)'));

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'Education CRM - Documentation',
        version: '0.0.1'
      }
    }
  }))
  .use(routes(''))
  .listen(config.port);
