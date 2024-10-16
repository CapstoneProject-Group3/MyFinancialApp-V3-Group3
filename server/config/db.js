import Sequelize from 'sequelize';

//const sequelize = new Sequelize('mysql://root:food@localhost:3306/MySQLfood1');
const sequelize = new Sequelize('mysql://root:root@localhost:8889/login');

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('access success');
  } catch (error) {
    console.error('access failed:', error.message);
    throw error;
  }
};

export default sequelize;
