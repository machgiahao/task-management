const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database  = require("./config/database");
require("dotenv").config();

const routesApiVer1 = require("./api/v1/routes/index.route");

database.connect();
const app = express();
const port = process.env.PORT;

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// cookie parser
app.use(cookieParser());

routesApiVer1(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
