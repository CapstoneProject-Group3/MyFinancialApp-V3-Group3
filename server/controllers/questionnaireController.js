import RiskManage from "../models/RiskManageModel.js";
import jwt from "jsonwebtoken";

const submitQuiz = async (req, res) => {
  const answers = req.body;
  let totalScore = 0;

  const scoreMapping = {
    Q1: { A: 0, B: 5, C: 10 },
    Q2: { A: 0, B: 2, C: 4, D: 5, E: 7, F: 10 },
    Q3: { A: 8, B: 4, C: 1 },
    Q4: { A: 0, B: 2, C: 5, D: 7, E: 10 },
    Q5: { A: 0, B: 2, C: 4, D: 6, E: 8, F: 10 },
    Q6: { A: 10, B: 5, C: 4, D: 2 },
    Q7: { A: 20, B: 8, C: 3, D: 1 },
    Q8: { A: 0, B: 4, C: 6, D: 10 },
    Q9: { A: 0, B: 3, C: 6, D: 8, E: 10 },
    Q10: { A: 0, B: 3, C: 6, D: 10 },
    Q11: { A: 0, B: 3, C: 6, D: 10 },
    Q12: { A: 0, B: 3, C: 5, D: 10 },
  };

  Object.entries(answers).forEach(([question, answer]) => {
    if (scoreMapping[question] && scoreMapping[question][answer]) {
      totalScore += scoreMapping[question][answer];
    }
  });

  let riskRating;
  if (totalScore <= 30) {
    riskRating = "Very Conservative";
  } else if (totalScore <= 50) {
    riskRating = "Conservative";
  } else if (totalScore <= 70) {
    riskRating = "Balanced";
  } else if (totalScore <= 100) {
    riskRating = "Growth";
  } else {
    riskRating = "Aggressive Growth";
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await RiskManage.create({
      userId,
      riskLevel: riskRating,
      totalScore,
      assessmentDate: new Date(),
    });

    res.json({ totalScore, riskRating });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
    console.error('Token has expired:', error);
    return res.status(401).json({ error: 'Token has expired' });
  } else if (error.name === 'JsonWebTokenError') {
    console.error('Invalid token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  } else {
    console.error("Error saving risk assessment:", error);
    res.status(500).json({ error: "Unable to save risk assessment." });
  }
 }
};

const getRiskLevel = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const riskInfo = await RiskManage.findOne({
      where: { userId },
      attributes: ["riskLevel", "totalScore", "assessmentDate"],
      order: [["assessmentDate", "DESC"]],
    });

    if (riskInfo) {
      res.json(riskInfo);
    } else {
      res
        .status(404)
        .json({ error: "No risk assessment found for this user." });
    }
  } catch (error) {
    console.error("Error fetching risk info:", error);
    res.status(500).json({ error: "Unable to fetch risk information." });
  }
};

export { submitQuiz, getRiskLevel };
