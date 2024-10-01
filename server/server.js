import express from "express";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import sequelize from './config/db.js';

const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());

connectDB()
  .then(() => {
    sequelize.sync({ force: true })
      .then(() => {
        app.listen(port, () => {
          console.log(`http://localhost:${port}`);
        });
      })
      .catch(error => {
        console.error('access failed:', error);
      });
  })
  .catch((error) => {
    console.error('access failed:', error);
  });

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("api Working");
});
