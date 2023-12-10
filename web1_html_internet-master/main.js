var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
    
  if(pathname === '/') {                //1. 루트일 때 실행(오류X)
    if(queryData.id === undefined) {    //2. 쿼리 스트링 없을 때 실행 (홈 O)
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var template =`
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>
          ${description}  <!-- 읽어온 파일 내용 표시 -->
        </p>
      </body>
      </html>
      `;
      response.writeHead(200);
      response.end(template); //template 문자열 응답

    }else {       //3. 쿼리 스트링 있을 때 실행 (홈 X)
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;        
        var template =`
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>
          <h2>${title}</h2>
          <p>
            ${description}  <!-- 읽어온 파일 내용 표시 -->
          </p>
        </body>
        </html>
        `;
        response.writeHead(200);
        response.end(template); //template 문자열 응답
      });
    }

  } else { //4. 루트가 아니 때 실행(오류 O)
    response.writeHead(400);
    response.end('Not found');
  }
});
app.listen(3000);