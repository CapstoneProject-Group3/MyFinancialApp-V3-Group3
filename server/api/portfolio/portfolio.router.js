import express from 'express';

import{
    handleRiskAssessment,
    fetchPortfolioById
} from './portfolio.controller.js';

const router = express.Router();

router.post("/assess-risk", handleRiskAssessment);
router.get("/:userId", fetchPortfolioById);

export default router;