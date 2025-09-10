const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("TaskTracker backend is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
