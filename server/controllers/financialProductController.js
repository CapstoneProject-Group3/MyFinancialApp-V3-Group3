import FinancialProduct from '../models/financialProductModel.js';   
import fs from 'fs';
import XLSX from 'xlsx';

export const createFinancialProduct = async (req, res) => {
    try {
        const { name, type, institution, interestRate, description, riskLevel, fee } = req.body;

        const newProduct = await FinancialProduct.create({
            name,
            type,
            institution,
            interestRate,
            description,
            riskLevel,
            fee
        });

        res.status(201).json({
            message: 'Financial product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating financial product',
            error: error.message
        });
    }
};

export const queryFinancialProductsByType = async (req, res) => {
    try {
        const { type } = req.query;

        const products = await FinancialProduct.findAll({
            where: {
                type: type
            }
        });

        res.status(200).json({
            message: `Financial products of type ${type} fetched successfully`,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error querying financial products by type',
            error: error.message
        });
    }
};

export const queryFinancialProductsByTypes = async (req, res) => {
    try {
        const { types } = req.query;

        const typesArray = types ? types.split(',') : [];

        const products = await FinancialProduct.findAll({
            where: {
                type: typesArray
            }
        });
        res.status(200).json({
            message: 'Financial products fetched successfully for specified types',
            data: products
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error querying financial products by types',
            error: error.message
        });
    }
};

export const importProductsFromExcel = async (req, res) => {
    const filePath = req.file?.path;

    if (!filePath) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const products = XLSX.utils.sheet_to_json(worksheet);

        const createdProducts = await FinancialProduct.bulkCreate(products);

        fs.unlinkSync(filePath); 

        res.status(201).json({
            message: 'Products imported successfully',
            data: createdProducts
        });
    } catch (error) {
        fs.unlinkSync(filePath); 
        console.error('Error importing products:', error);
        res.status(500).json({
            message: 'Error importing products',
            error: error.message
        });
    }
};