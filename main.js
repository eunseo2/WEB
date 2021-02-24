var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title,list,body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;

}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  //URL 분석 id : css
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id; // .id니까 css만 나옴

    if(pathname === '/'){
      if(queryData.id=== undefined){ // queryData.id 값이 없다면
            fs. readdir('./data',function(error,filelist){ // readdir(검색할 디렉토리) function(이름 아무거나 써도 상관X)
                // console.log(filelist);  data 디렉토리에 있는 목록들
                var title = 'Welcome';
                var description='Hello,Node.js';
                var list= templateList(filelist);

                /*
                var list=`  <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                  </ul>`;
                */
                var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);
            })


      } else{ //querydata id 가 있다면

        fs.readdir('./data', function(error, filelist){
          /*var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
          }
          list = list+'</ul>';
          */
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){

          var list=templateList(filelist);
          var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        });
       });
      }

    } else {
      response.writeHead(404);
      response.end('Not found');
    }



});
app.listen(3000);
