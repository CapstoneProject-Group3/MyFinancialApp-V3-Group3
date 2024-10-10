import { DataTypes } from 'sequelize';
import sequelize from '../config/database_portfolio.js';

const Portfolio = sequelize.define('Portfolio', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    riskLevel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stocksPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    bondsPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cashOrEquivalentsPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'investmentPortfolio',
    timestamps: false  // Assuming table does not use timestamps
});

export default Portfolio;
