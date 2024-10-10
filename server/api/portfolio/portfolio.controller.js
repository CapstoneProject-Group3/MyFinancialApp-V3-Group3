import {
    getPortfolioByRisk,
    createOrUpdatePortfolio,
    getPortfolioById
} from './portfolio.service.js';


const handleRiskAssessment = async (req, res) => {
        const { userId, riskLevel } = req.body;
        console.log("Received risk assessment:", { userId, riskLevel });  // Log input data

        try {
            const allocation = getPortfolioByRisk(riskLevel);
            const portfolioData = {
                userId,
                riskLevel,
                stocksPercentage: allocation.stocks,
                bondsPercentage: allocation.bonds,
                cashOrEquivalentsPercentage: allocation.cashOrEquivalents
            };

            const result = await createOrUpdatePortfolio(userId, portfolioData);
            res.status(200).json({
                success: 1,
                message: result.updated ? "Portfolio updated successfully" : "Portfolio created successfully",
                data: portfolioData
            });
        } catch (error) {
            res.status(500).json({ success: 0, message: error.message });
        }
};

const fetchPortfolioById = async (req, res) => {
    const userId = req.params.userId;
    console.log("Fetching portfolio for userId:", userId);

    try {
        const portfolio = await getPortfolioById(userId);
        res.status(200).json({
            success: 1,
            data: portfolio
        });
    } catch (error) {
        res.status(404).json({ success: 0, message: error.message });
    }
};

export {
    handleRiskAssessment,
    fetchPortfolioById
};