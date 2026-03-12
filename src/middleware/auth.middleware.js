const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: "Invalid credentials"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
       
        if (decoded) {
            req.user = { id: decoded.id }
            next()
        } else {
            return res.json({
                success: false,
                message: "Invalid token"
            })
        }

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

module.exports = userAuth;