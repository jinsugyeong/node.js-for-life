/**
 *  <쿠키의 용도>
 *  1. 세션 관리(인증) : 서버에 저장해야 할 정보를 관리
 *  2. 개인화: 사용자 선호, 테마 등의 설정
 *  3. 트래킹: 사용자 행동을 기록ㅎ파고 분석하는 행동
 */
var http = require('http');
http.createServer(function(request, response) {
    /*
    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 'tasty_cookie=starwberry']
    });
    response.writeHead로 Set-Cookie 했을땐 응답헤더에만 yummy_cookie=choco', 'tasty_cookie=starwberry가 뜨지만,
    주석처리 후 다시 새록로침해보면 요청헤더에 각각의 항목으로 들어가 있다.
    */
    response.end('Cookie!!');
}).listen(3000);