import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { privateApiPlugin } from "./privateRoutes";
import { publicApiPlugin } from "./publicRoutes";
import mongoose from "mongoose";

await mongoose.connect(Bun.env.MONGODB || '')
  .then(() => console.log('Successfuly connected to MongoDB'))
  .catch(() => console.log('Provide the "MONGODB" env variable (link to database server)'));

const app = new Elysia()
  .use(swagger())
  .use(publicApiPlugin(''))
  .use(privateApiPlugin('/api'))
  .listen(3002);
