const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var template = require('./lib/template.js');

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

app.get('/page', function(feq, res) {
  return res.send('/page')
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