const express = require("express");
const bodyParser = require("body-parser")
const database  = require("./config/database");
require("dotenv").config();

const routesApiVer1 = require("./api/v1/routes/index.route");

database.connect();
const app = express();
const port = process.env.PORT;

routesApiVer1(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
