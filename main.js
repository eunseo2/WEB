var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring'); // post 방식으로 전송된 데이터 받기
var template = require('./lib/template.js')
var path = require('path'); //보안

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
                var list= template.list(filelist);

                /*
                var list=`  <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                  </ul>`;
                */

                /*var list = '<ul>';
                var i = 0;
                while(i < filelist.length){
                  list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                  i = i + 1;
                }
                list = list+'</ul>';
                */
                var html = template.HTML(title,list,`<h2>${title}</h2>${description}`,
                  `<a href="/create"> create</a> `
                );
                response.writeHead(200);
                response.end(html);
            })


      } else{ //querydata id 가 있다면

        fs.readdir('./data', function(error, filelist){ // 파일 목록 알아내기

        var filteredId = path.parse(queryData.id).base; //보안 ../password 막 사용자가 접근할 수 있는거 막는 것임 filter
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){

          var list=template.list(filelist);
          var html = template.HTML(title,list,`<h2>${title}</h2>${description}`,
          `<a href="/create"> create</a>
           <a href="/update?id=${title}"> update</a>

          <form action="delete_process" method="post" onsubmit="return confirm('do you want to delete this file?')">
           <input type="hidden" name="id" value="${title}">
           <input type="submit" value="delete">
          </form>`// 삭제는 <a href> 링크로 하면 안됨 get방식으로 했을 때 그 링크 다른 사람한테 보내면 그 페이지 삭제되니까 위험

          );
          response.writeHead(200);
          response.end(html);
        });
       });
      }

    }else if(pathname==='/create'){
      fs. readdir('./data',function(error,filelist){ // readdir(검색할 디렉토리) function(이름 아무거나 써도 상관X)
          // console.log(filelist);  data 디렉토리에 있는 목록들
          var title = 'WEB- create';
          var list= template.list(filelist);
          var html = template.HTML(title,list,`
            <form action="/create_process"  method ="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `,''); //create랑 update 버튼 필요없으므로 공백문자로 주기!
          response.writeHead(200);
          response.end(html);
        });
     } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){ //data 다 받으면
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',function(err){ //err은 에러가 있을 때 처리하는 방법

          response.writeHead(302, {Location: `/?id=${title}`});//redirect 다른 페이지 보여주기 create_process에서 nodejs title, description 보여주기 위해서
          response.end('success');


        })
        //response.writeHead(200);
        // response.end(`<h1>${title}</h1> ${description}`); 받은거 보여줄때

      });

    }else if(pathname==='/update'){
      fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var list=template.list(filelist);
        var html = template.HTML(title,list,
          `
          <form action="/update_process"  method ="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description"> ${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
          `,
        `<a href="/create"> create</a> <a href="/update?id=${title}"> update</a>`
        // value는 기본값
        );
        response.writeHead(200);
        response.end(html);
      });
     });
   } else if(pathname ==='/update_process'){
     var body = '';
     request.on('data', function(data){
         body = body + data;
     });
     request.on('end', function(){ //data 다 받으면
       var post = qs.parse(body);
       var id = post.id;
       var title = post.title;
       var description = post.description;
       fs.rename(`data/${id}`, `data/${title}`, function(error){
       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
         response.writeHead(302, {Location: `/?id=${title}`});
         response.end();
       })
     });
 });
} else if(pathname ==='/delete_process'){
     var body = '';
     request.on('data', function(data){
         body = body + data;
     });
     request.on('end', function(){ //data 다 받으면
       var post = qs.parse(body);
       var id = post.id;
       var filteredId = path.parse(id).base;
       fs.unlink(`data/${filteredId}`,function(error){
         response.writeHead(302, {Location: `/`});
         response.end();
       })

     });
   }
     else {
      response.writeHead(404);
      response.end('Not found');
    }



});
app.listen(3000);
