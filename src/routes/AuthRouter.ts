import express from "express";
import { AuthController } from "../controller/AuthController";

export const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
authRouter.post("/admin/signup", authController.signupAdmin);
