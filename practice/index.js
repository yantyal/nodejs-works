const http = require('http');
const fs = require('fs');

const server = http.createServer(
    (req, res)=>{
        targetFile='';
        switch(req.url){
            case '/':
            case '/index.js':
                targetFile=fs.readFileSync('./index.html','utf-8');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(targetFile);
                break;
            case '/works.css':
                targetFile=fs.readFileSync('./works.css', 'utf-8');
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(targetFile);
                break;
            case '/responsive.css':
                targetFile=fs.readFileSync('./responsive.css', 'utf-8');
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(targetFile);
                break;
            case '/works_image_01.png':
                targetFile=fs.readFileSync('./works_image_01.png');
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.end(targetFile);
                break;
            default:
                res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
                res.end('<h1>エラー　ファイルが見つかりません</h1>');
        }

    }
);

server.listen(8000);

console.log('start...');