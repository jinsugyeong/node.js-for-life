const express = require('express')
const app = express() //express라는 모듈 자체 호출(애플리케이션 객체 리턴)
const port = 3000
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static('public'));
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.get('*', function(request, response, next) { //GET방식으로 전송하는 요청일 때만 미들웨어가 실행될 때마다
  fs.readdir('./data', function(error, filelist) {  //data 디렉터리에 있는 파일 목록을 가져와
    request.list = filelist;  //request.list에 담고
    next(); //next함수 호출 <- 그 다음에 실행해야할 미들웨어 의미
  });
});

/**
 *  < 보안과 관련된 지침 >
 * 
 * - 익스프레스 버전을 최신으로 유지
 * - TLS 사용 : HTTPS 프로토콜 사용
 * - Helmet 모듈 사용 : npm install --save helmet
 * - 쿠키를 안전하게 사용
 * - 종속 모듈이 안전한지 확인 : npm i nsp -g, nsp check
 * - 그 외의 알려진 취약점 회피
 * - 추가적인 고려사항
 */

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})


/* ---------------------------------------------------------
2024-02-22  express 사용을 위한 기존 내용 주석 처리

var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname; 
  
  //루트일 때 실행(오류X)
  if(pathname === '/') {     

    //쿼리 스트링 없을 때 실행 (홈 O)                  
    if(queryData.id === undefined) {                  
      topic.home(request, response);
    }

    //쿼리 스트링 있을 때 실행 (홈 X)
    else {                                   
      topic.page(request, response);
    }
  }

  // 글 관련
  else if(pathname === '/create') { 
    topic.create(request, response);
  } else if(pathname === '/create_process') {
    topic.create_process(request, response);
  } else if(pathname === '/update') {         
    topic.update(request, response);
  } else if(pathname === '/update_process') { 
    topic.update_process(request, response);
  } else if(pathname === '/delete_process') { 
    topic.delete_process(request, response);
  }

  //저자 관련
  else if(pathname === '/author') {
    author.home(request, response);
  } else if(pathname === '/author/create_process') {
    author.create_process(request, response);
  } else if(pathname === '/author/update') {
    author.update(request, response);
  } else if(pathname === '/author/update_process') {
    author.update_process(request, response);
  } else if(pathname === '/author/delete_process') {
    author.delete_process(request, response);
  }


  //루트가 아닐 때 실행(오류 O)
  else {                                    
    response.writeHead(400);
    response.end('Not found');
  }
});
app.listen(3000);
------------------------------------------------------------*/