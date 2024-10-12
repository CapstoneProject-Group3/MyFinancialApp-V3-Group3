import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const RiskManage = sequelize.define('risk_manage', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    riskLevel: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalScore: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    assessmentDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});

export default RiskManage;
