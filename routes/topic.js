var express = require('express');
var router = express.Router();  //express가 가지고 있는 Router메서드 호출(router 객체 리턴)
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');
var template = require('../lib/template.js');
var cookie = require('cookie');

function authIsOwner(request, response) {
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.id === 'jsg' && cookies.password === '0000') {
        isOwner = true;
    }
    return isOwner;
}

function authStatusFn(request, response) {
    var authStatusUI = '<a href="/login">login</a>';
    if(authIsOwner(request, response)) {
        authStatusUI = '<a href="/logout_process">logout</a>';
    }
    return authStatusUI;
}

//main.js에서 /topic/경로 로 요청하기 때문에 앞에 /topic들 지워줘야함
router.get('/create', function(request, response) {

    if(authIsOwner(request, response) === false) {
        response.end('Login required!!');
        return false;
    }

    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `, authStatusFn(request, response)
);
response.send(html);
})

//전달방식이 post기 때문에 post메서드 사용
router.post('/create_process', function(request, response){

    if(authIsOwner(request, response) === false) {
        response.end('Login required!!');
        return false;
    }

    var post = request.body;  //body-parser가 만들어 준 데이터가 들어가 있음
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.redirect(`/topic/${title}`);
        response.end();
    });
})


router.get('/update/:pageId', function(request, response) {

    if(authIsOwner(request, response) === false) {
        response.end('Login required!!');
        return false;
    }

    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
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
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
        authStatusFn(request, response)
        );
        response.end(html);
    });
})

router.post('/update_process', function(request, response) {

    if(authIsOwner(request, response) === false) {
        response.end('Login required!!');
        return false;
    }

    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.redirect(`/topic/${title}`);
            response.end();
        });
    });
})

router.post('/delete_process', function(request, response) {

    if(authIsOwner(request, response) === false) {
        response.end('Login required!!');
        return false;
    }

    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error) {
        response.redirect('/');
    });
})

//시맨틱 URL 처리방식 , 사용자가 요청한 URL'키:값' 형태로 가져오기
router.get('/:pageId', function(request, response, next) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        if(err) {
        next(err);
        }else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
            `<a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form>`,
            authStatusFn(request, response)
        );
        response.send(html);
        }
    });
})

// *무엇을 익스포트할 것인지 명시해야함
module.exports = router;