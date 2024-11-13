
import jwt from 'jsonwebtoken';
import FinancialProduct from '../models/financialProductModel.js';
import Portfolio from '../models/portfolioModel.js';
import Recommendation from '../models/recommendationModel.js';
import { getPortfolioByUserId } from './portfolioController.js'

export const generateAndSaveRecommendation = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { selectedProducts } = req.body;

        // Validate selectedProducts
        if (!selectedProducts || !Array.isArray(selectedProducts) || !selectedProducts.length) {
            return res.status(400).json({ message: "Invalid or missing product selection." });
        }

        // Retrieve the user's portfolio settings
        const portfolio = await getPortfolioByUserId(req, res);
        if (!portfolio) {
            return res.status(404).json({ message: "No portfolio found for this user." });
        }

        // First, remove all existing recommendations for this user
        await Recommendation.destroy({
            where: { userId }
        });

        // Generate new recommendations based on the latest selected products
        const recommendations = await Promise.all(selectedProducts.map(async product => {
            // Calculate investment proportion based on the portfolio
            const proportion = calculateInvestmentProportion(product.type, portfolio);

            // Save the recommendation
            const newRecommendation = await Recommendation.create({
                userId: userId,
                productId: product.id,
                name: product.name,
                type: product.type,
                institution: product.institution,
                interestRate: product.interestRate,
                description: product.description,
                riskLevel: product.riskLevel,
                investmentProportion: proportion
            });

            return newRecommendation;
        }));

        res.status(200).json({
            message: 'Recommendation generated and saved successfully',
            data: recommendations
        });
    } catch (error) {
        console.error("Error in processing recommendation:", error);
        res.status(500).json({ error: 'Failed to process recommendation request.', details: error.message });

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            return res.status(500).json({ error: 'Failed to process recommendation request.' });
        }
    }
};

function calculateInvestmentProportion(type, portfolio) {
    switch (type) {
        case 'Stock':
            return portfolio.Stock;
        case 'Fund':
            return portfolio.Fund;
        case 'Cash&Equivalent':
            return portfolio['Cash&Equivalent'];
        default:
            return 0;  // Default proportion if product type does not match
    }
}

export const getAllRecommendations = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch all recommendations for the logged-in user
        const recommendations = await Recommendation.findAll({
            where: { userId }
        });

        res.status(200).json({
            message: 'Recommendations fetched successfully',
            data: recommendations
        });
    } catch (error) {
        console.error("Error in fetching recommendations:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            return res.status(500).json({ error: 'Failed to fetch recommendations.' });
        }
    }
};

