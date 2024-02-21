var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

/**
 * 글 삭제 처리
 * @param {*} request 
 * @param {*} response 
 */
exports.delete_process = function(request, response) {
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
}

/**
 * 글 수정 처리
 * @param {*} request 
 * @param {*} response 
 */
exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });

  request.on('end', function(data) {
    var post = qs.parse(body);
    db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
      [post.title, post.description, post.author, post.id], function(error, result) {
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      }
    );
  });
}

/**
 * 글 수정 화면
 * @param {*} request 
 * @param {*} response 
 */
exports.update = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function(error, topics) {
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], function(error2, topic) {
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM author`, function(error2, authors) {
        var t = topic[0];
        var list = template.list(topics);
        var html = template.HTML(sanitizeHtml(t.title), list, 
                  `<form action="/update_process" method="POST">
                    <input type="hidden" name="id" value="${t.id}" />
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(t.title)}" /></p>
                    <p>
                      <textarea name="description" placeholder="description">${sanitizeHtml(t.description)}</textarea>
                    </p>
                    <p>
                      <!-- 작성자 리스트, 현재 작성자-->
                      ${template.authorSelect(authors, topic[0].author_id)}
                    </p>
                    <p><input type="submit" /></p>
                  </form>
                `, `<a href="/create">create</a> <a href="/update?id=${t.id}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}

/**
 * 글 생성 처리
 * @param {*} request 
 * @param {*} response 
 */
exports.create_process = function(request, response) {
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
      console.log(post);
      db.query(`INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
        [post.title, post.description, post.author], function(error, result) {
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      );
    });
}

/**
 * 글 생성 화면
 * @param {*} request 
 * @param {*} response 
 */
exports.create = function(request, response) {
  db.query(`SELECT * FROM topic`, function(error, topics) {
    db.query('SELECT * FROM author', function(error2, authors) {
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(title, list, 
        `<form action="create_process" method="POST">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
            ${template.authorSelect(authors)}
          <p><input type="submit"></p>
          </form>
        `, 
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

/**
 * 글 상세 조회
 * @param {*} request 
 * @param {*} response 
 */
exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic AS t LEFT JOIN author AS a ON t.author_id = a.id WHERE t.id = ?`
          , [queryData.id], function(error2, topic) {
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list, 
                    `<h2>${sanitizeHtml(title)}</h2>
                    ${sanitizeHtml(description)}
                    <p>by ${sanitizeHtml(topic[0].name)}</p>`,
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

/**
 * 글 목록 조회
 * @param {*} request 
 * @param {*} response 
 */
exports.home = function(request, response) {
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
}