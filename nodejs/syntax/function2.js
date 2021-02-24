console.log(Math.round(1.6));//2 round 반올림해줌 round(입력값)
console.log(Math.round(1.4));//1


function sum(first,second){ //parameter 매개변수
  console.log('a');
  return first+second // return을 만나면 함수는 즉시 종료
  console.log('b'); // 실행 안됨
}


console.log(sum(2,4)); //argument
