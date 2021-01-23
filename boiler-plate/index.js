//벡엔드 시작점 --save 쓰면 package 에 저장됨 expressjs.com 14

const express = require("express"); // 모듈을 가지고 온다
const app = express(); // 앱을 만든다
const port = 5000; // 포트 생성
const bodyParser = require(`body-parser`);
const config = require(`./config/key`);
const { User } = require("./models/User");
const cookieParser = require(`cookie-parser`);

//appication/x-www-form-urlencoded 데이터를 가져오는 것
app.use(bodyParser.urlencoded({ extended: true }));

//appication/json 데이터 가져오는 것
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require(`mongoose`);
mongoose
  .connect(
    config.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    } // 에러 안 뜨게 하는 법
  )
  .then(() => console.log(`MongoDB Contected`))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  // root 디렉토리에 오면 hello 출력하게함 -> 라우터
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  //회원 가입 할떄 필요한 정보들을  client에서 가져오면
  //그것들을  데이터 베이스에 넣어준다.
  //   {
  //     "name":"lle",
  //     "email":"ljh9716@naver.com",
  //     "password":"1234"
  // }
  const user = new User(req.body);

  // save 하기 전에 암호화를 먼저 해줘야 한다
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post(`/login`, (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는 지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    // 요청된 이메일을 findOne에서 찾고 그것에 대한 응답을 json 형식으로 보낸다.
    if (!user) {
      // email이 확인이 안됨
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      // comparePassword에 사용자가 입력한 패스워드를 User.js 에 옮겨짐 callback함수로부터 나온 err,isMatch값이 2번째 인자로 나옴

      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });

      user.generateToken((err, user) => {
        // user 안에 토큰이 들어있다 토큰은 쿠키에 or 로컬스토리지에 저장 -> 쿠키를 깔자 cookie-parser
        if (err) return res.status(400).send(err);

        res
          .cookie(`x_auth`, user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id }); // x_auth 쿠키에 토큰이 저장
      }); //함수이름 바꿔도 됨
    });
  });
  //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인

  // 비밀번호 까지 맞다면 토큰을 생성하기
});

app.listen(port, () => {
  // 5000번에서 실행하게 함
  console.log(`Example app listening at http://localhost:${port}`);
});

//yarn add body-parser --save
//postman 설치
// node mon == pm2 ->yarn add nodemon --save-dev
// 비밀번호 노출 안되게 하기 위해 yarn add bcrypt --save
// 비밀번호 맞다면 유저의 토큰을 생성해야한다 yarn add jsonwebtoken --save
//yarn add cookie-parser --save
