//백엔드 시작점

const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => res.send("hi express!!!!"));

app.listen(port, console.log("hi, su-brothers!!!"));
