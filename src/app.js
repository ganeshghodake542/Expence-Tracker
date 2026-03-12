const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");

const app = express();


app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use("/api/user", userRoutes); 



module.exports = app;