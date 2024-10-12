import express from "express";
import { submitQuiz, getRiskLevel } from "../controllers/questionnaireController.js";
const riskManageRouter = express.Router();

riskManageRouter.post("/submit-quiz", submitQuiz);
riskManageRouter.get('/risk-level', getRiskLevel);

export default riskManageRouter;
