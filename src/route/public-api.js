import express from "express";
import authController from "../controller/auth-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/login', authController.login);

export {
    publicRouter
}
