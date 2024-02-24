var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = express();

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.get('/', function (req, res, next) {
    console.log(req.session);
    //세션 데이터는 서버의 메모리에 저장되므로 node.js 서버를 종료하면 세션이 지워진다 
    if(req.session.num === undefined) {
        req.session.num = 1;
    }else {
        req.session.num = req.session.num + 1;
    }
    res.send(`View : ${req.session.num}`);
})

app.listen(3000, function(){
    console.log('3000!');
});