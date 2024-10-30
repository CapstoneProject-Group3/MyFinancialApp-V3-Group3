import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const FinancialProduct = sequelize.define('financialProduct', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    institution: {
        type: Sequelize.STRING,
        allowNull: false
    },
    interestRate: {
        type: Sequelize.STRING,
        allowNull: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    riskLevel: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

export default FinancialProduct;
