/*
function a(){
  console.log('A');
}
*/
var a = function (){ // 익명함수 a변수가 함수 값을 가짐
  console.log('A');
}
//a(); -> A나

function slowfunc(callback){
  callback();
}

slowfunc(a); //A나옴
