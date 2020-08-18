//백엔드 시작점

const express = require("express");
const mysql = require("mysql");
const dbconfig = require("../server/config/database"); //정보 보호
const connection = mysql.createConnection(dbconfig); //커넥션 설정
const app = express();
const port = 5000;
app.use(express.json()); //서버 요청의 값은 body로 들어온다. body에 넣어주기 위해 사용한다.

app.get("/", (req, res) => res.send("hi express!!!!"));

app.get("/api/test", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (error, result, fields) => {
    if (error) throw error;
    res.send(result);
    console.log(result);
  });
});

app.listen(port, console.log("hi, su-brothers!!!"));
