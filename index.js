require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const routes = require("./routes/routes");
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(routes);

const server = app.listen(port, () => {});

module.exports = server;