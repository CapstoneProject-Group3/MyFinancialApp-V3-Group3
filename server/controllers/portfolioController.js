// controllers/portfolioController.js
import jwt from 'jsonwebtoken';
import Portfolio from '../models/portfolioModel.js';
//import { getPortfolioByRisk } from '../services/portfolioService.js';

const portfolioAllocations = {
    'Very Conservative': { stocks: [10, 20], bonds: [75, 85], cashOrEquivalents: [5, 5] },
    Conservative: { stocks: [20, 30], bonds: [60, 70], cashOrEquivalents: [5, 10] },
    Balanced: { stocks: [40, 60], bonds: [40, 50], cashOrEquivalents: [0, 10] },
    Growth: { stocks: [70, 85], bonds: [10, 25], cashOrEquivalents: [0, 5] },
    'Aggressive Growth': { stocks: [85, 100], bonds: [0, 10], cashOrEquivalents: [0, 5] }
};

function selectPortfolioAllocation(allocationRanges) {
    let stocks = selectValueWithinRange(...allocationRanges.stocks);
    let bonds = selectValueWithinRange(...allocationRanges.bonds);
    let cashOrEquivalents = 100 - stocks - bonds;

    // Ensure cashOrEquivalents falls within the specified range
    if (cashOrEquivalents < allocationRanges.cashOrEquivalents[0] ||
        cashOrEquivalents > allocationRanges.cashOrEquivalents[1])
    {
        // Adjust stocks and bonds down if cashOrEquivalents is too high
        if (cashOrEquivalents > allocationRanges.cashOrEquivalents[1]) {
            let excess = cashOrEquivalents - allocationRanges.cashOrEquivalents[1];
            stocks -= Math.ceil(excess / 2);
            bonds -= Math.floor(excess / 2);
            cashOrEquivalents = 100 - stocks - bonds;
        }
        // Adjust stocks and bonds up if cashOrEquivalents is too low
        else {
            let shortfall = allocationRanges.cashOrEquivalents[0] - cashOrEquivalents;
            stocks += Math.ceil(shortfall / 2);
            bonds += Math.floor(shortfall / 2);
            cashOrEquivalents = 100 - stocks - bonds;
        }
    }

    return { stocks, bonds, cashOrEquivalents };
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
    console.log("Received request:", req.body);
    const token = req.headers.authorization?.split(" ")[1];
    //console.log("Authorization token:", token);
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        console.log("JWT Secret:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("Decoded user ID:", userId);
        // Fetch risk level from body and calculate allocations
        const { riskLevel } = req.body;
        console.log("Received risk level:", riskLevel);

        if (!riskLevel) {
            return res.status(400).json({ error: "Risk level is required" });
        }

        const allocation = getPortfolioByRisk(riskLevel);
        console.log("Calculated allocation:", allocation);
        // Attempt to find and update, or create a new portfolio
        const portfolio = await Portfolio.findOne({ where: { userId } });
        if (portfolio) {
            // Update existing portfolio
            await Portfolio.update({
                stocks: allocation.stocks,
                bonds: allocation.bonds,
                cashOrEquivalents: allocation.cashOrEquivalents,
                riskLevel: riskLevel
            }, {
                where: { userId }
            });
            res.json({ message: "Portfolio updated", portfolio: {...portfolio.toJSON(), ...allocation} });
        } else {
            // Create new portfolio
            const newPortfolio = await Portfolio.create({
                userId,
                stocks: allocation.stocks,
                bonds: allocation.bonds,
                cashOrEquivalents: allocation.cashOrEquivalents,
                riskLevel
            });
            console.log("Created new portfolio:", newPortfolio);
            res.status(201).json({ message: "Portfolio created", portfolio: newPortfolio });
        }
    } catch (error) {
        console.error("Error in processing portfolio:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            console.error("Error in processing portfolio:", error);
            return res.status(500).json({ error: 'Failed to process portfolio request.' });
        }
    }
};
