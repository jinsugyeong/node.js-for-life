var a = function () {
    console.log('A');
}

function slowfunc(callback) {
    //시간이 오래 걸리는 함수 >> 이 함수가 끝나면 자동으로 어떤 함수를 호출해줘
    callback();
}

slowfunc(a);