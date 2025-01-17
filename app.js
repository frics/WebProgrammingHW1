const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');
const passport = require('passport');



//.env파일을 읽어서 process.env로 만든다.
//여러 비밀 키들을 .env에 저장하여 꺼내서 사용 
dotenv.config();
//라우터 선언 
const mainRouter = require('./routes');
const authRouter = require('./routes/auth');
const aboutRouter = require('./routes/about');
const boardRouter = require('./routes/board');
const galleryRouter = require('./routes/gallery');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
//monggo DB 연결 
const connect = require('./models');
connect();

//실행될 포트 지정
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure('views', {
        express : app,
        watch : true,
});


//morgan은 서버로 들어온 요청과 응답을 기록해줌
//dev, tiny, short등 여러가지 모드가 있다,
app.use(morgan('dev'));

//static은 정적인 파일들의 경로를 제공해준다.
//요청주소와 실제 주소를 다르게 해서 보안성에 도움을 준다. 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
//json 타입의 요청이 들어왔을때 해석해준다.
app.use(express.json());
//객체 형태 데이터의 중첩을 허용하지 않는다. 
app.use(express.urlencoded({ extended : false}));
//요청 헤더의 쿠키를 해석
//쿠키의 비밀키를 붙여줘야한다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
        resave : false,
        saveUninitialized : false,
        //env파일에서 정보를 받아온다.
        secret : process.env.COOKIE_SECRET,
        cookie : {
                httpOnly: true,
                secure : false,
        },
        name : 'session-cookie',
}));

app.use(passport.initialize());
app.use(passport.session());

//main 라우터 경로 연결
app.use('/', mainRouter);
app.use('/auth', authRouter);
// about 라우터 경로 연결
app.use('/about', aboutRouter);
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);


//라우터로 지정되지 않은 경로가 들어왔을떄
app.use((req, res, next) => {
        res.status(404).send('404 NOT FOUND');
})
/*
app.use((req, res, next) => {
        console.log('요청 실행할 수 있다.');
        //다음 미들웨어로 넘어간다.
        next();
});
app.get('/', (req, res) => {
        console.log('GET 요청 실행');
        //다음 미들웨어로 넘어간다.
        next();
}, (req, res) => {
        throw new Error("에러 발생시 에러처리 미들웨어로 넘긴다");
});*/
//에러처리 미들웨어
app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
        res.status(err.status || 500);
        console.error(err);
        //에러에 따라 http상태 코드 지정
        res.render('error');
});
/*
app.use((req, res, next) => {
        //이런식으로 미들웨어간에 데이터 전송이 가능하다.
        //해당 데이터는 요청 하나를 처리하는 동안만 유지가 된다.
        //다른곳에서 쓰이는 이름과 겹치면 안된다.
        req.data = '데이터 넣기';
        next();
});
*/

//서버가 실행될 포트 지정
app.listen(app.get('port'), () => {
        console.log(app.get('port'), '번 포트에서 대기중');
});

