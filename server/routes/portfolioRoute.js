import express from 'express';
import { submitPortfolio } from '../controllers/portfolioController.js';

const portfolioRouter = express.Router();

// Route to create or update a portfolio based on the risk level
portfolioRouter.post('/', (req, res, next) => {
    console.log('Request received on /api/portfolio');
    next();
}, submitPortfolio);

// Route to retrieve a user's portfolio
//router.get('/portfolio', fetchPortfolio);

export default portfolioRouter;


/*
import express from 'express';

import{
    handleRiskAssessment,
    fetchPortfolioById
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post("/assess-risk", handleRiskAssessment);
router.get("/:userId", fetchPortfolioById);

export default router;
*/