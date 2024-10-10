import Portfolio from "../../models/portfolioModel.js";

const portfolioAllocations = {
    veryConservative: { stocks: [10, 20], bonds: [75, 85], cashOrEquivalents: [5, 5] },
    conservative: { stocks: [20, 30], bonds: [60, 70], cashOrEquivalents: [5, 10] },
    balanced: { stocks: [40, 60], bonds: [40, 50], cashOrEquivalents: [0, 10] },
    growth: { stocks: [70, 85], bonds: [10, 25], cashOrEquivalents: [0, 5] },
    aggressiveGrowth: { stocks: [85, 100], bonds: [0, 10], cashOrEquivalents: [0, 5] }
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

async function createOrUpdatePortfolio(userId, portfolioData) {
    try {
        let portfolio = await Portfolio.findByPk(userId);
        if (portfolio) {
            await Portfolio.update(portfolioData, { where: { userId: userId } });
            return { updated: true, portfolioId: userId };
        } else {
            portfolio = await Portfolio.create({ ...portfolioData, userId });
            return { created: true, portfolioId: portfolio.insertId };
        }
    } catch (error) {
        throw error;
    }
}

async function getPortfolioById(userId) {
    try {
        const portfolio = await Portfolio.findByPk(userId);
        if(!portfolio) {
            throw new Error("Portfolio not found");
        }
        return portfolio;
    }catch(error){
        throw error;
    }
}

export {
    getPortfolioByRisk,
    createOrUpdatePortfolio,
    getPortfolioById
}