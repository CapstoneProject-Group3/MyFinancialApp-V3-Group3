import express from 'express';
import { generateAndSaveRecommendation, getAllRecommendations } from '../controllers/recommendationController.js';

const recommendationRouter = express.Router();

// Endpoint to generate and save a new recommendation
recommendationRouter.post("/generate", generateAndSaveRecommendation);

// Endpoint to fetch all recommendations for the current user
recommendationRouter.get("/list", getAllRecommendations);

export default recommendationRouter;
