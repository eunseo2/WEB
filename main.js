var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // post 방식으로 전송된 데이터 받기

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
    <a href="/create"> create</a>
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

    }else if(pathname==='/create'){
      fs. readdir('./data',function(error,filelist){ // readdir(검색할 디렉토리) function(이름 아무거나 써도 상관X)
          // console.log(filelist);  data 디렉토리에 있는 목록들
          var title = 'WEB- create';
          var list= templateList(filelist);
          var template = templateHTML(title,list,`
            <form action="http://localhost:3000/create_process"  method ="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `);
          response.writeHead(200);
          response.end(template);
        });
     } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        response.writeHead(200);
        // response.end(`<h1>${title}</h1> ${description}`); 받은거 보여줄때

      });
      response.writeHead(200);
      response.end('ssssss');
}
     else {
      response.writeHead(404);
      response.end('Not found');
    }



});
app.listen(3000);
