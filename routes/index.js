var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');

router.get('/', function(request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list, 
        `<h2>${title}</h2>${description}
        <img src="/images/capybara.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response)
        );
        response.send(html);
})
/*
router.get('/login', function(request, response){
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, 
        `<form action="/login_process" method="post">
            <p><input type="text" name="id" placeholder="id" /></p>
            <p><input type="password" name="password" placeholder="password" /></p>
            <p><input type="submit" /></p>
        </form>`,
        `<a href="/topic/create">create</a>`
        );
    response.send(html);
})

router.post('/login_process', function(request, response) {
    var post = request.body;

    if(post.id === 'jsg' && post.password === '0000'){
        response.cookie('id', post.id, {httpOnly: true});
        response.cookie('password', post.password, {httpOnly: true});
        response.cookie('nickname', 'gangsuter', {httpOnly: true, maxAge: 100000000});
        response.redirect(`/`);
        response.end();

    }else {
        response.end('Who?');
    }
})

router.get('/logout_process', function(request, response) {
    var post = request.body;

    response.clearCookie('id');
    response.cookie('password');
    response.cookie('nickname');
    
    response.redirect(`/`);
    response.end();
}) 
*/

module.exports = router;