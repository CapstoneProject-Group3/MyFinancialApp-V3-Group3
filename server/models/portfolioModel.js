import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const Portfolio = sequelize.define('portfolios',{
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    stocks: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    bonds: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    cashOrEquivalents: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    riskLevel: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

export default Portfolio;

/*
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
*/