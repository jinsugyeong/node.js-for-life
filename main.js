const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.get('*', function(request, response, next) { //GET방식으로 전송하는 요청일 때만 미들웨어가 실행될 때마다
  fs.readdir('./data', function(error, filelist) {  //data 디렉터리에 있는 파일 목록을 가져와
    request.list = filelist;  //request.list에 담고
    next(); //next함수 호출 <- 그 다음에 실행해야할 미들웨어 의미
  });
});

app.get('/', function(request, response) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list, 
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
    );
    response.send(html);
})

//시맨틱 URL 처리방식 , 사용자가 요청한 URL'키:값' 형태로 가져오기
app.get('/page/:pageId', function(request, response) {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
    var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
      `<a href="/create">create</a>
      <a href="/update/${sanitizedTitle}">update</a>
      <form action="/delete_process" method="post">
        <input type="hidden" name="id" value="${sanitizedTitle}">
        <input type="submit" value="delete">
      </form>`
    );
    response.send(html);
  });
});

app.get('/create', function(request, response) {
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
              <input type="submit">
          </p>
      </form>
  `, '');
  response.send(html);
})

//전달방식이 post기 때문에 post메서드 사용
app.post('/create_process', function(request, response){
  var post = request.body;  //body-parser가 만들어 준 데이터가 들어가 있음
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
    response.writeHead(302, {Location: `/page/${title}`});
    response.end();
  });
})

app.get('/update/:pageId', function(request, response) {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
              <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
              <input type="submit">
          </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update/${title}">update</a>`
    );
    response.end(html);
  });
})

app.post('/update_process', function(request, response) {
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.redirect(`/page/${title}`);
          response.end();
      });
  });
});

app.post('/delete_process', function(request, response) {
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error) {
    response.redirect('/');
  });
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