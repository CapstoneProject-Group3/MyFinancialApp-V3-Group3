import Sequelize from 'sequelize';

// 创建 Sequelize 实例
const sequelize = new Sequelize('mysql://root:Capstone6806@localhost:3306/FinancialAPP');

// 定义并导出 connectDB 函数
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('连接到 MySQL 数据库成功');
  } catch (error) {
    console.error('连接失败:', error.message);
    throw error; // 抛出错误以便可以处理失败的情况
  }
};

// 导出 Sequelize 实例以便在其他文件中可以直接使用
export default sequelize;
