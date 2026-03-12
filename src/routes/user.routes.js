const express = require("express");
const router = express.Router();
const authUser = require("../middleware/auth.middleware")
const userController = require("../controller/user.controller");

router.post("/register", userController.register );
router.post("/login", userController.login );

router.get("/user-details", authUser, userController.getCurrentUserDetails );
router.put("/update-profile", authUser, userController.updateUserProfile );

module.exports = router;