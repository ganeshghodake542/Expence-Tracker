const { asyncWrapProviders } = require("node:async_hooks");
const incomeModel = require("../models/income.models")
const XLSX = require("xlsx");
const { default: getDateRange } = require("../utils/dataFilter");

const addIncome = async (req, res) => {

    const userId = req.user.id;
    const { description, amount, category, date } = req.body;

    try {

        if (!description || !amount || !category || !date) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        })

        await newIncome.save();

        return res.json({
            success: true,
            message: "Income added successfully"
        })

    } catch (err) {

        return res.json({
            success: false,
            message: err.message
        })

    }
}

const getIncome = async (req, res) => {

    const userId = req.user._id;

    try {

        const income = await incomeModel.find({ userId }).sort({ date: -1 });

        return res.json({
            success: true,
            income
        })

    } catch (e) {

        return res.json({
            success: false,
            message: e.message
        })

    }

}

const updateIncome = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    const { description, amount } = req.body

    try {
        const income = await incomeModel.findOneAndUpdate(
            { _id: id, userId: userId },
            { description, amount }
        )

        if (!income) {
            return res.json({
                success: false,
                message: "income not added"
            })
        }

        return res.json({
            success: true,
            income
        })


    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

const deleteIncome = async (req, res) => {
    try {
        const income = await incomeModel.findOneAndDelete({ _id: req.params.id })

        if (!income) {
            return res.json({
                success: true,
                message: " Add income"
            })
        }
        return res.json({
            success: true,
            message: " Income deleted"
        })
    }
    catch (e) {
        return res.json({
            success: false,
            message: e.message
        })
    }
}


const toDownloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const income = await income.model.find({ userId }).sort({ date: -1 })

        const plainData = income.map((inc) => ({
            description: inc.description,
            amount: inc.amount,
            category: inc.category,
            data: new DataTransfer(inc.date).toLocalDataString()
        }));

        const workSheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, workSheet, "incomeModel");
        XLSX.writeFile(workbook, "income_details.xlsx")

        res.download("income_details.xlsx")

    } catch (e) {
        return res.json({
            success: false,
            message: e.message
        })

    }
}

const getIncomeOverview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { range = " monthly" } = req.query;
        const { start, end } = getDateRange(range)

        const income = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 })


        const totalIncome = income.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = income.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = income.length;

        const recentTransactions = income.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        })


    } catch (e) {
        return res.json({
            success: false,
            message: e.message
        })

    }
}






module.exports = { addIncome, getIncome, updateIncome, deleteIncome, toDownloadIncomeExcel, getIncomeOverview };