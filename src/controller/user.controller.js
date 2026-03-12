const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
        return res.json({
            success: false,
            message: "All field's are required to fill"
        })
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists..!"
            })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({ name, email, password: hash })
        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token)

        res.json({
            success: true,
            message: "User registered successfully"
        })


    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "All field are required to fill"
        })
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.json({
                success: false,
                message: "User not registered"
            })
        }

        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            return res.json({
                success: false,
                message: "password incorrect"
            })
        }

        const token = await jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token);

        return res.json({
            success: true,
            message: "User login succesfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        });
    }
}


const getCurrentUserDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("name email")

        if (!user) {
            return res.json({
                success: false,
                message: "User not exist"
            })
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}



const updateUserProfile = async (req, res) => {

    const { email, name } = req.body;

    if (!email || !name) {
        return res.json({
            success: false,
            message: "All field are required"
        })
    }

    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        user.name = req.body.name
        user.email = req.body.email
        await user.save();

        return res.json({
            success: true,
            message: "Profile updated succcessfully"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })

    }

}

const updateUserPassword = async (req, res) => {

    const { currentPassword, password } = req.body;

    if (!currentPassword || !password) {
        return res.json({
            success: false,
            message: "Current password and new password required"
        })
    }

    try {

        const user = await userModel.findById(req.user.id).select("password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res.json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        return res.json({
            success: true,
            message: "Password changed successfully"
        })

    } catch (e) {

        return res.json({
            success: false,
            message: e.message
        })

    }

}


module.exports = { register, login, getCurrentUserDetails, updateUserProfile, updateUserPassword }
