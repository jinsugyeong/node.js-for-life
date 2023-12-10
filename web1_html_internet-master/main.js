var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    if(_url == '/') {
        title = 'Welcome'; //요청받은 URL이 /(root)이면 실행
        _url = '/index.html';
    }
    if(_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
    var template =`
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="index.html">WEB</a></h1>
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
    response.end(template); //template 문자열 응답
  });
});
app.listen(3000);