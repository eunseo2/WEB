var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);
})

// [css,html,javascript] data에 있는 파일 목룍 보여줌.
