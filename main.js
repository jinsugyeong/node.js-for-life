const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');

app.get('/', function(req, res) {
  fs.readdir('./data', function(erroer, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list, 
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
      );
      res.send(html);
  })
})

//시맨틱 URL 처리방식 , 사용자가 요청한 URL'키:값' 형태로 가져오기
app.get('/page/:pageId', function(req, res) {
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
      var title = req.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});
      var list = template.list(filelist);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
        `<a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
      );
      res.send(html);
    });
  });
});

app.get('/create', function(req, res) {
  fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
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
    res.send(html);
  });
})

//전달방식이 post기 때문에 post메서드 사용
app.post('/create_process', function(req, res){
  var body = '';
  req.on('data', function(data) {
      body = body + data;
  });
  req.on('end', function() {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        res.writeHead(302, {Location: `/page/${title}`});
        res.end();
      });
  });
})

app.get('/update/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
      var title = request.params.pageId;
      var list = template.list(filelist);
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
  });
})

app.post('/update_process', function(request, response) {
  var body = '';
  request.on('data', function(data) {
      body = body + data;
  });
  request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error) {
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
              response.writeHead(302, {Location: `/page/${title}`});
              response.end();
          });
      });
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