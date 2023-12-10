var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname; 
    
  if(pathname === '/') {                //1. 루트일 때 실행(오류X)
    if(queryData.id === undefined) {    //2. 쿼리 스트링 없을 때 실행 (홈 O)         
      fs.readdir('./data',function(error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template =templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

        response.writeHead(200);
        response.end(template); //template 문자열 응답
      });

    }else {       //3. 쿼리 스트링 있을 때 실행 (홈 X)
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        fs.readdir('./data',function(error, filelist) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template =templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);

          response.writeHead(200);
          response.end(template); //template 문자열 응답
        });
      });
    }

  } else {                              //4. 루트가 아닐 때 실행(오류 O)
    response.writeHead(400);
    response.end('Not found');
  }
});
app.listen(3000);

/**
 * 본문 셋팅 함수
 * @param {*} title 제목
 * @param {*} list 글 목록
 * @param {*} body 본문
 * @returns 중복코드 => template
 */
function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
  </html>
  `;
}

/**
 * 파일목록 읽는 함수
 * @param {*} filelist 
 * @returns 
 */
function templateList(filelist) {
  var i = 0;
  var list = '<ul>';
  while(i < filelist.length) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list += '</ul>';
  return list;
}