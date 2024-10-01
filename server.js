import express from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import sequelize from './config/db.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection and server startup
connectDB()
  .then(() => {
    // 同步数据库表结构
    sequelize.sync({ force: true })
      .then(() => {
        console.log('数据库同步完成');
        // 数据库同步后启动服务器
        app.listen(port, () => {
          console.log(`服务器运行在 http://localhost:${port}`);
        });
      })
      .catch(error => {
        console.error('数据库同步失败:', error);
      });
  })
  .catch((error) => {
    console.error('数据库连接失败:', error);
  });

// api endpoints
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});
