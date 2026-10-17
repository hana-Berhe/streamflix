import express from "express";
import { authRouter } from "./api/auth/routes/auth.routes.js";
import { userRouter } from "./api/user/routes/user.routes.js";
import { myListRouter } from "./api/myList/routes/myList.routes.js";
import { ratingRouter } from "./api/rating/routes/rating.routes.js";
import { aiRouter } from "./api/ai/routes/ai.routes.js";

export const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/my-list", myListRouter);
mainRouter.use("/ratings", ratingRouter);
mainRouter.use("/ai", aiRouter);
