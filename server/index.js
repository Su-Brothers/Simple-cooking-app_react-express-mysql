//백엔드 시작점

const express = require("express");
const userRouter = require("./routes/user");
const writeRouter = require("./routes/write");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5000;
app.use(express.json()); //서버 요청의 값은 body로 들어온다. body에 넣어주기 위해 사용한다.
app.use(cookieParser());
//라우트 분리
app.use("/api/users", userRouter);
app.use("/api/write", writeRouter);

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => res.send("hi express!!!!"));

app.listen(port, console.log("hi, su-brothers!!!"));
