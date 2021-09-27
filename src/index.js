const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const bucketRouter = require("./routers/bucket");
const path = require("path");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT;

//seperate routers
app.use(express.json());
app.use(userRouter);
app.use(bucketRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

//background-color: #e67e22;
