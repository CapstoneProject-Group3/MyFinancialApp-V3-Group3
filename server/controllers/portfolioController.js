// controllers/portfolioController.js
import jwt from 'jsonwebtoken';
import Portfolio from '../models/portfolioModel.js';

const portfolioAllocations = {
    'Very Conservative': { stocks: [25, 30], bonds: [60, 65], cashOrEquivalents: [5, 15] },
    Conservative: { stocks: [35, 40], bonds: [55, 60], cashOrEquivalents: [5, 10] },
    Balanced: { stocks: [50, 55], bonds: [35, 40], cashOrEquivalents: [5, 10] },
    Growth: { stocks: [60, 65], bonds: [25, 30], cashOrEquivalents: [5, 10] },
    'Aggressive Growth': { stocks: [80, 100], bonds: [0, 10], cashOrEquivalents: [0, 10] }
};

function selectPortfolioAllocation(allocationRanges) {
    let stocks = selectValueWithinRange(...allocationRanges.stocks);
    let bonds = selectValueWithinRange(...allocationRanges.bonds);
    let cashOrEquivalents = 100 - stocks - bonds;

    // Correct values to ensure cashOrEquivalents is not negative and within the range
    if (cashOrEquivalents < 0) {
        let adjustment = Math.abs(cashOrEquivalents);
        let adjustStocks = Math.ceil(adjustment / 2);
        let adjustBonds = Math.floor(adjustment / 2);

        stocks -= adjustStocks > stocks ? stocks : adjustStocks;
        bonds -= adjustBonds > bonds ? bonds : adjustBonds;
        cashOrEquivalents = 100 - stocks - bonds;
    }

    // Ensure cashOrEquivalents falls within the specified range
    if (cashOrEquivalents < allocationRanges.cashOrEquivalents[0]) {
        let shortfall = allocationRanges.cashOrEquivalents[0] - cashOrEquivalents;
        if (stocks > shortfall) {
            stocks -= shortfall;
        } else {
            bonds -= shortfall - stocks;
            stocks = 0;
        }
        cashOrEquivalents = 100 - stocks - bonds;
    } else if (cashOrEquivalents > allocationRanges.cashOrEquivalents[1]) {
        let excess = cashOrEquivalents - allocationRanges.cashOrEquivalents[1];
        if (stocks + excess <= 100) {
            stocks += excess;
        } else {
            stocks = 100 - bonds;
        }
        cashOrEquivalents = 100 - stocks - bonds;
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
    //console.log("Received request:", req.body);
    const token = req.headers.authorization?.split(" ")[1];
    //console.log("Authorization token:", token);
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        //console.log("JWT Secret:", process.env.JWT_SECRET);

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
