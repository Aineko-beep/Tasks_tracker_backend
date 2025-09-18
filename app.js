const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require('dotenv').config();

const routes = require("./src/routes");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("TaskTracker backend is running");
});


const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

initDatabase();
