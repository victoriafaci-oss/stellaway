import express from "express";
import { registerApiRoutes } from "../src/lib/registerApiRoutes";

const app = express();
app.use(express.json());
registerApiRoutes(app);

export default app;
