//백엔드 시작점
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const writeRouter = require("./routes/write");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5000;
const corsOptions = {
  origin: "https://dn9g4x7ek29ym.cloudfront.net",
  credentials: true,
};
app.use(express.json()); //서버 요청의 값은 body로 들어온다. body에 넣어주기 위해 사용한다.
app.use(cookieParser()); //쿠키 사용
app.use(cors(corsOptions)); //cors 처리
//라우트 분리
app.use("/api/users", userRouter);
app.use("/api/write", writeRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => res.send("hi express!!!!"));

app.listen(port, console.log("hi, su-brothers!!!"));
