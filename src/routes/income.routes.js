const express = require("express");
const router = express.Router();
const authUser = require("../middleware/auth.middleware")
const incomeController = require("../controller/income.controller");



router.post("/add", authUser, incomeController.addIncome );
router.get("/get", authUser, incomeController.getIncome );

router.put("/update/:id", authUser, incomeController.updateIncome );
router.get("/downloadexcel", authUser, incomeController.toDownloadIncomeExcel );

router.delete("/delete/:id", authUser, incomeController.deleteIncome );
router.get("/overview", authUser, incomeController.getIncomeOverview );

module.exports = router;