var express = require('express');
var router = express.Router();  //express가 가지고 있는 Router메서드 호출(router 객체 리턴)
var bodyParser = require('body-parser');
var template = require('../lib/template.js');

var authData = {
    email: 'jsg@mail.com',
    password: '0000',
    nickname: '세계서열0위'
}

router.get('/login', function(request, response) {
    var title = 'WEB - lgoin';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p>
                <input type="submit" value="logain">
            </p>
        </form>
        `,''
    );
    response.send(html);
})

router.post('/login_process', function(request, response){
    var post = request.body; 
    var email = post.email;
    var password = post.password;
    if(email === authData.email && password === authData.password) {
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(function(){
            response.redirect(`/`);
        });
    }else {
        response.send('Who?');
    }
})

router.get('/logout', function(request, response) {
    request.session.destroy(function(err){
        response.redirect('/');
    });
});

/*
router.get('/update/:pageId', function(request, response) {
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
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        response.end(html);
    });
})

router.post('/update_process', function(request, response) {
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
            </form>`,''
        );
        response.send(html);
        }
    });
})
*/
module.exports = router;