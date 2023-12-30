import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { privateApiPlugin } from "./privateRoutes";
import { publicApiPlugin } from "./publicRoutes";

const app = new Elysia()
  .use(swagger())
  .use(publicApiPlugin(''))
  .use(privateApiPlugin('/api'))
  .listen(3002);
