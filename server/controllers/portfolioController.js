// controllers/portfolioController.js
import jwt from 'jsonwebtoken';
import Portfolio from '../models/portfolioModel.js';

const portfolioAllocations = {
    'Very Conservative': { Stock: [25, 30], Fund: [50, 55], 'Cash&Equivalent': [15, 20] },
    Conservative: { Stock: [35, 40], Fund: [55, 60], 'Cash&Equivalent': [5, 10] },
    Balanced: { Stock: [50, 55], Fund: [35, 40], 'Cash&Equivalent': [5, 10] },
    Growth: { Stock: [60, 65], Fund: [25, 30], 'Cash&Equivalent': [5, 10] },
    'Aggressive Growth': { Stock: [80, 100], Fund: [0, 10], 'Cash&Equivalent': [0, 10] }
};

function selectPortfolioAllocation(allocationRanges) {
    let Stock = selectValueWithinRange(...allocationRanges.Stock);
    let Fund = selectValueWithinRange(...allocationRanges.Fund);
    let CashAndEquivalent = 100 - Stock - Fund; // Use a valid JavaScript identifier

    if (CashAndEquivalent < 0) {
        let adjustment = Math.abs(CashAndEquivalent);
        let adjustStock = Math.ceil(adjustment / 2);
        let adjustFund = Math.floor(adjustment / 2);

        Stock -= adjustStock > Stock ? Stock : adjustStock;
        Fund -= adjustFund > Fund ? Fund : adjustFund;
        CashAndEquivalent = 100 - Stock - Fund;
    }

    const cashRange = allocationRanges['Cash&Equivalent'];
    if (CashAndEquivalent < cashRange[0]) {
        let shortfall = cashRange[0] - CashAndEquivalent;
        if (Stock > shortfall) {
            Stock -= shortfall;
        } else {
            Fund -= shortfall - Stock;
            Stock = 0;
        }
        CashAndEquivalent = 100 - Stock - Fund;
    } else if (CashAndEquivalent > cashRange[1]) {
        let excess = CashAndEquivalent - cashRange[1];
        if (Stock + excess <= 100) {
            Stock += excess;
        } else {
            Stock = 100 - Fund;
        }
        CashAndEquivalent = 100 - Stock - Fund;
    }

    return { Stock, Fund, CashAndEquivalent };
}

function selectValueWithinRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPortfolioByRisk(riskLevel) {
    const allocationRanges = portfolioAllocations[riskLevel];
    if (allocationRanges) {
        return selectPortfolioAllocation(allocationRanges);
    } else {
        throw new Error("Invalid risk level");
    }
}

// Controller to handle submitting or updating a portfolio based on questionnaire response
export const submitPortfolio = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { riskLevel } = req.body;

        if (!riskLevel) {
            return res.status(400).json({ error: "Risk level is required" });
        }

        const allocation = getPortfolioByRisk(riskLevel);
        const portfolio = await Portfolio.findOne({ where: { userId } });
        if (portfolio) {
            await Portfolio.update({
                Stock: allocation.Stock,
                Fund: allocation.Fund,
                ['Cash&Equivalent']: allocation.CashAndEquivalent
            }, {
                where: { userId }
            });
            res.json({ message: "Portfolio updated", portfolio: {...portfolio.toJSON(), ...allocation} });
        } else {
            const newPortfolio = await Portfolio.create({
                userId,
                Stock: allocation.Stock,
                Fund: allocation.Fund,
                ['Cash&Equivalent']: allocation.CashAndEquivalent,
                riskLevel
            });
            res.status(201).json({ message: "Portfolio created", portfolio: newPortfolio });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            return res.status(500).json({ error: 'Failed to process portfolio request.' });
        }
    }
};

// fetch portfolio by userId
export const getPortfolioByUserId = async (req, res) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const portfolio = await Portfolio.findOne({ where: { userId } });
        if (!portfolio) {
            console.log("No portfolio found for user:", userId);
            return res.status(404).json({ message: "No portfolio found for this user." });
        }
        return portfolio;
    } catch (error) {
        console.error("Error retrieving portfolio for user ID:", userId, error);
        return res.status(500).json({ error: 'Failed to retrieve portfolio' });
    }
};
