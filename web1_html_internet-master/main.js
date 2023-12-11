var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname; 
    
  if(pathname === '/') {                //루트일 때 실행(오류X)
    if(queryData.id === undefined) {    //쿼리 스트링 없을 때 실행 (홈 O)         
      fs.readdir('./data',function(error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template =templateHTML(title, list,
          `<h2>${title}</h2><p>${description}</p>`,
          `<a href="/create">create</a>`);

        response.writeHead(200);
        response.end(template); //template 문자열 응답
      });
    }else {                             //쿼리 스트링 있을 때 실행 (홈 X)
      fs.readdir('./data',function(error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template =templateHTML(title, list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href="/create">create</a>
             <a href="/update?id=${title}">update</a>
             <form id="deleteForm" action="/delete_process" method="POST">
               <input type="hidden" name="id" value="${title}" />
               <input type="button" value="delete" id="deleteBtn" />
             </form>`);
          response.writeHead(200);
          response.end(template); 
        });
      });
    }


  } else if(pathname === '/delete_process') {    //delete_process일 때 실행
    var body = '';

    request.on('data', function(data) {
      body = body + data;
    });

    request.on('end', function(data) {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(err){
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
    
    
  } else if(pathname === '/update') {    //update일 때 실행
    fs.readdir('./data',function(error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        var title = queryData.id;
        var list = templateList(filelist);
        var template =templateHTML(title, list,`
        <form action="/update_process" method="POST">
          <input type="hidden" name="id" value="${title}" />
          <p><input type="text" name="title" placeholder="title" value="${title}" /></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p><input type="submit" /></p>
        </form>
      `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

        response.writeHead(200);
        response.end(template); 
      });
    });


  } else if(pathname === '/update_process') {    //update_process일 때 실행
    var body = '';

    request.on('data', function(data) {
      body = body + data;
    });

    request.on('end', function(data) {
      var post = qs.parse(body);
      var id = post.id; //기존 title
      var title = post.title; //변경할 title
      var description = post.description;
      fs.rename(`data/${id}`,`data/${title}`, function(err){ 
        if(err)
          console.log(err);
        else {
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        }
      });
      
    });


  } else if(pathname === '/create') {   //create일 때 실행
    fs.readdir('./data',function(error, filelist) {
      var title = 'create';
      var description = 'Hello, Node.js';
      var list = templateList(filelist);
      var template =templateHTML(title, list, `
        <form action="/create_process" method="POST">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p>
            <textarea name="description" placeholder="description" ></textarea>
          </p>
          <p><input type="submit" /></p>
        </form>
      `, '');

      response.writeHead(200);
      response.end(template); 
    });


  }else if(pathname === '/create_process') {  //create_process일 때 실행
    var body = '';

    request.on('data', function(data) {
      //조각조각 나눠서 데이터를 수신할 때마다 호출되는 콜백 함수
      //데이터를 처리하는 기능을 정의
      body = body + data;
    });
    request.on('end', function(data) {
      //더이상 수신할 정보가 없으면 호출되는 콜백 함수
      //데이터 처리를 마무리하는 기능을 정의
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
                  //   파일 ,  파일에 쓸 내용 ,  인코딩 방식, callback
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
      });
    });




  } else {                              //루트가 아닐 때 실행(오류 O)
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
function templateHTML(title, list, body, control) {
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
      ${control}
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