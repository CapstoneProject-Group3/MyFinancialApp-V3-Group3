import express from 'express';
import multer from 'multer';
import { createFinancialProduct, queryFinancialProductsByType, queryFinancialProductsByTypes, importProductsFromExcel } from '../controllers/financialProductController.js';

const financialProductRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

financialProductRouter.post("/create", createFinancialProduct);
financialProductRouter.get("/queryByType", queryFinancialProductsByType);
financialProductRouter.get("/queryByTypes", queryFinancialProductsByTypes);
financialProductRouter.post("/upload", upload.single('file'), importProductsFromExcel);

export default financialProductRouter;