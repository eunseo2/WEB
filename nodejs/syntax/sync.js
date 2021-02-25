var fs = require('fs');

//readFileSync 동기적 결과: A B C
/*
console.log('A');
var result= fs.readFileSync('nodejs/syntax/sample.txt','utf8');
console.log(result);
console.log('C');
*/

//비동기  결과 : A C B
console.log('A');
fs.readFile('nodejs/syntax/sample.txt','utf8',function(err,result){ //err 에러가 있다는 에러인자, 파일의 내용인자
    console.log(result);
});

console.log('C');
