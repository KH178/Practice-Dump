
const http = require('http');
const fs = require('fs');

const Transform = require('stream').Transform;

let downloaded = 0;
  var streamLogs = new Transform({
    decodeStrings: false
  });

  streamLogs._transform = function(chunk, encoding, done) {
    downloaded += chunk.length;
    console.log(`Download: `,bytesToSize(downloaded))
    // for (const [key,value] of Object.entries(process.memoryUsage())){
    //     console.log(`Memory usage by ${key}, ${value/1000000}MB `)
    // }
    done(null, chunk);
  };
  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 1000)/1000 + ' ' + sizes[i];
 }


const PORT = 8000;

const server = http.createServer((req, res) => {
    if(fs.existsSync('./result.iso')) fs.unlinkSync('./result.iso')
    const writeStream = fs.createWriteStream('./result.iso');
    req.pipe(streamLogs).pipe(writeStream);
    req.on('end', () => {
        console.log('The file was successfully written.');
        res.end('OK');
    });
});

server.listen(PORT, () => {
    console.log(`Server has been started on port ${server.address().port}`);
});