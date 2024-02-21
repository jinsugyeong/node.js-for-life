var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var db = require('./lib/db');
var topic = require('./lib/topic');
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname; 
    
  if(pathname === '/') {                      //루트일 때 실행(오류X)
    if(queryData.id === undefined) {          //쿼리 스트링 없을 때 실행 (홈 O)         
      topic.home(request, response);
    }else {                                   //쿼리 스트링 있을 때 실행 (홈 X)
      topic.page(request, response);
    }

  } else if(pathname === '/delete_process') { //delete_process일 때 실행
    topic.delete_process(request, response);

  } else if(pathname === '/update') {         //update일 때 실행
    topic.update(request, response);
  } else if(pathname === '/update_process') { //update_process일 때 실행
    topic.update_process(request, response);

  } else if(pathname === '/create') {         //create일 때 실행
    topic.create(request, response);
  } else if(pathname === '/create_process') { //create_process일 때 실행
    topic.create_process(request, response);

  } else {                                    //루트가 아닐 때 실행(오류 O)
    response.writeHead(400);
    response.end('Not found');
  }
});
app.listen(3000);