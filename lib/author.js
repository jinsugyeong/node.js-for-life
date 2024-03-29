var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

/**
 * 저자 삭제 처리(저자 삭제 시 작성한 글도 함께 삭제되게)
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
    db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], function(error1, result1) {
        if(error1) {
            throw error1;
        }
        db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, result) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
            }
        );
    });
    });
}

/**
 * 저자 수정 처리
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
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name, post.profile, post.id], function(error, result) {
        if(error) {
            throw error;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
        }
    );
    });
}


/**
 * 저자 수정 화면
 * @param {*} request 
 * @param {*} response 
 */
exports.update = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author) {
                var title = 'Author';
                var list = template.list(topics);
                var html = template.HTML(title, list, 
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" placeholder="name" value="${queryData.id}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${sanitizeHtml(author[0].name)}">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="새로운 저자를 등록하세요">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `, ``
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

/**
 * 저자 생성 처리
 * @param {*} request 
 * @param {*} response 
 */
exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
    body = body + data;
    });
    request.on('end', function(data) {
    var post = qs.parse(body);
    db.query(`INSERT INTO author(name, profile) VALUES(?, ?)`,
        [post.name, post.profile], function(error, result) {
        if(error) {
            throw error;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
        }
    );
    });
}

/**
 * 저자 목록 조회
 * @param {*} request 
 * @param {*} response 
 */
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, function(error, topics) {
        db.query(`SELECT * FROM author`, function(error2, authors) {
            var title = 'Author';
            var list = template.list(topics);
            var html = template.HTML(title, list, 
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td {
                    border: 1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="새로운 저자를 등록하세요"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}