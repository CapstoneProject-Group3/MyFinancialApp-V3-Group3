
import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const Recommendation = sequelize.define('recommendations', {
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
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'financialProducts',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
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
    },
    investmentProportion: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    /*
    link: {
        type: Sequelize.STRING,
        allowNull: true
    }
    */
}, {
    timestamps: false  // Enable timestamps to track when recommendations are created
});

export default Recommendation;
