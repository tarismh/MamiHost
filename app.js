const express = require("express");
const app = express();
require("dotenv").config();
const { sequelize } = require("./models");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen({ port: process.env.PORT, host: process.env.HOST }, async () => {
    console.log(
        "Berjalan Pada Port " +
            process.env.PORT +
            " dan host " +
            process.env.HOST
    );
    await sequelize.authenticate();
    console.log("Terhubung Dengan Database!");
});

const corsOptions = {
    credentials: true,
    origin: true,
};

app.get("/", (req, res) => res.send("Welcome To MamiHost API"));

const {
    UserRoute,
    PackageRoute,
    ServiceRoute,
    UserLogin,
} = require("./routes");

app.use(cors(corsOptions));
app.use("/user", UserRoute);
app.use("/package", PackageRoute);
app.use("/service", ServiceRoute);
app.use("/login", UserLogin);

module.exports = app;
