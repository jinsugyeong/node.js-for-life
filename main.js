var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'jinsugyeong',
  'password':'as0098',
  database:'opentutorials'
});
db.connect();
var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname; 
    
  if(pathname === '/') {                //루트일 때 실행(오류X)
    if(queryData.id === undefined) {    //쿼리 스트링 없을 때 실행 (홈 O)         
      db.query(`SELECT * FROM topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list, 
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    }else {                             //쿼리 스트링 있을 때 실행 (홈 X)
      db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function(error2, topic) {
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="/delete_process" method="POST">
                      <input type="hidden" name="id" value="${queryData.id}" />
                      <input type="submit" value="delete" />
                    </form>`);
          response.writeHead(200);
          response.end(html);
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
      db.query('DELETE FROM topic WHERE id=?',[post.id], function(error, result) {
          if(error) throw error;
          response.writeHead(302, {Location: `/`});
          response.end();
        }
      );
    });
    
    
  } else if(pathname === '/update') {    //update일 때 실행
    db.query(`SELECT * FROM topic`, function(error, topics) {
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function(error2, topic) {
        if(error2){
          throw error2;
        }
        var t = topic[0];
        var list = template.list(topics);
        var html = template.HTML(t.title, list, 
                  `<form action="/update_process" method="POST">
                    <input type="hidden" name="id" value="${t.id}" />
                    <p><input type="text" name="title" placeholder="title" value="${t.title}" /></p>
                    <p>
                      <textarea name="description" placeholder="description">${t.description}</textarea>
                    </p>
                    <p><input type="submit" /></p>
                  </form>
                `, `<a href="/create">create</a> <a href="/update?id=${t.id}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });


  } else if(pathname === '/update_process') {    //update_process일 때 실행
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });

    request.on('end', function(data) {
      var post = qs.parse(body);
      db.query('UPDATE topic SET title=?, description=?, author_id=3 WHERE id=?',
        [post.title, post.description, post.id], function(error, result) {
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        }
      );
    });


  } else if(pathname === '/create') {   //create일 때 실행
    db.query(`SELECT * FROM topic`, function(error, topics) {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(title, list, 
        `<form action="create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p><input type="submit"></p>
          </form>
        `, 
        `<a href="/create"></a>`
      );
      response.writeHead(200);
      response.end(html);
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
      db.query(`
        INSERT INTO topic
        (
          title
          ,description
          ,created
          ,author_id
        )
        VALUES(
           ?
          ,?
          ,NOW()
          ,?
        )`,
        [post.title, post.description, 3],
        function(error, result) {
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      );
    });



  } else {                              //루트가 아닐 때 실행(오류 O)
    response.writeHead(400);
    response.end('Not found');
  }
});
app.listen(3000);