import combineRouters from "koa-combine-routers";
import { printEndpoints } from "../utils/Logger";
import userRoutes from "./user.routes";
import publicUserRoutes from "./user.public.routes";
import authRoutes from "./auth.routes";
import publicAuthRoutes from "./auth.public.routes";

printEndpoints(userRoutes, authRoutes, publicUserRoutes, publicAuthRoutes);

// For better security, role-based access should be implemented, but limited time.
export const privateRouter = combineRouters(userRoutes, authRoutes);
export const publicRouter = combineRouters(publicUserRoutes, publicAuthRoutes);
