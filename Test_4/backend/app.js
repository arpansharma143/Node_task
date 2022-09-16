const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRoutes = require("./Routes/userRoutes");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/", userRoutes);   

app.listen(3000);
