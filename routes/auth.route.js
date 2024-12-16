import expres from "express";
import { Login, RegisterUser } from "../controllers/auth.controller.js";
import { validateLoginUSer, validateUser } from "../middleware/validation.middleware.js";
const userRouter = expres.Router();

userRouter.post("/register", validateUser, RegisterUser);

userRouter.post("/login",validateLoginUSer, Login);

export default userRouter;
