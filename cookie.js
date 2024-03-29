/**
 *  <쿠키의 용도>
 *  1. 세션 관리(인증) : 서버에 저장해야 할 정보를 관리
 *  2. 개인화: 사용자 선호, 테마 등의 설정
 *  3. 트래킹: 사용자 행동을 기록ㅎ파고 분석하는 행동
 */
var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    if(request.headers.cookie !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);

    //처음엔 응답헤더에만 보이지만, 주석처리 후 다시 새로고침해보면 요청헤더에만 각각의 항목으로 들어가 있다.
    //이 후 다시 주석 풀고 실행하면 쿠키 삭제하는거 아닌 이상 계속 요청헤더 있음 
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=starwberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            'hi=hi; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie',
        ]
    });
    /**
     *  세션 쿠키(Session cookie) : 웹 브라우저가 켜져 있는 동안에만 유효한 쿠키 > yummy, tasty
     *  영구 쿠키(Permanent cookie) : 영속적인 쿠키로서 웹 브라우저를 종료했다가 다시 실행해도 살아있음 > Permanet
     *      ㄴ MaxAge(유지시간(초)) 또는 Expires(만료날짜)를 정의해야한다
     * 
     * 
     *  쿠키옵션
     *  - Secure : 웹 브라우저와 웹 서버가 HTTPS 프로토콜로 통신하는 경우에만 쿠키를 전송하는 옵션
     *  - HttpOnly : HTTP 프로토콜로 통신하는 경우에도 쿠키를 전송하지만, 자바스크립로는 쿠키값을 가져올 수 없게하는 옵션
     *  - Path : 특정 디렉터리(경로)에서만 쿠키가 활성화되게 하는 옵션
     *  - Domain : 어떤 서브도메인에서도 생성되는 쿠키를 만들 수 있는 옵션
     */
    
    
    response.end('Cookie!!');
}).listen(3000);