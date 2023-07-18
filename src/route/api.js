import express from "express";
import jobController from "../controller/job-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const router = new express.Router();

router.use(cors());
router.use(cookieParser());
router.use(authMiddleware);

router.get('/api/jobs', jobController.get);
router.get('/api/jobs/:id', jobController.getById);

export {
    router,
}
